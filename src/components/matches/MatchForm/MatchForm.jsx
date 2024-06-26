import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './MatchForm.module.css';

import {
  addMatch,
  editMatch,
  addMatchPlayer,
  deleteMatchPlayer,
} from '../../../utils/firebase/firestore/firestoreActions';
import {
  getInputFormattedDate,
  getInputFormattedTime,
  getInputFormattedNextMatchDate,
  getInputFormattedNextMatchSubscriptionDate,
} from '../../../utils/getDates';

const MatchForm = ({
  userPlayerProfile,
  tournament,
  tournamentPlayers,
  match,
  matchPlayers,
  availablePlayers,
}) => {
  const { tournamentId } = useParams();
  const [matchDate, setMatchDate] = useState(
    match?.dateTime
      ? getInputFormattedDate(match.dateTime)
      : tournament?.defaultMatchDay
      ? getInputFormattedNextMatchDate(tournament.defaultMatchDay)
      : getInputFormattedDate(new Date())
  );
  const [matchTime, setMatchTime] = useState(
    match?.dateTime
      ? getInputFormattedTime(match.dateTime)
      : tournament?.defaultMatchTime
      ? tournament.defaultMatchTime
      : getInputFormattedTime(new Date())
  );
  const matchAddressInputRef = useRef();
  const [teamPlayerQuota, setTeamPlayerQuota] = useState(
    match?.playerQuota
      ? match?.playerQuota / 2
      : tournament?.defaultPlayerQuota
      ? tournament.defaultPlayerQuota / 2
      : null
  );
  const [
    isSubscriptionStartsImmediatelySelected,
    setIsSubscriptionStartsImmediatelySelected,
  ] = useState(
    match?.subscriptionDateTime || tournament?.defaultMatchSubscriptionTime
      ? false
      : true
  );
  const [matchSubscriptionDate, setMatchSubscriptionDate] = useState(
    match?.subscriptionDateTime
      ? getInputFormattedDate(match.subscriptionDateTime)
      : tournament?.defaultMatchDay &&
        (tournament.defaultMatchSubscriptionDaysBefore ||
          tournament?.defaultMatchSubscriptionDaysBefore === 0)
      ? getInputFormattedNextMatchSubscriptionDate(
          tournament.defaultMatchDay,
          tournament.defaultMatchSubscriptionDaysBefore
        )
      : ''
  );
  const [matchSubscriptionTime, setMatchSubscriptionTime] = useState(
    match?.subscriptionDateTime
      ? getInputFormattedTime(match.subscriptionDateTime)
      : tournament?.defaultMatchSubscriptionTime
      ? tournament.defaultMatchSubscriptionTime
      : ''
  );
  const [playersToSubscribe, setPlayersToSubscribe] = useState(
    match ? matchPlayers : [userPlayerProfile]
  );
  const [tournamentAvailablePlayers, setTournamentAvailablePlayers] =
    useState(availablePlayers);
  const [isFinishedMatch, setIsFinishedMatch] = useState(
    match?.result.teamA ? true : false
  );
  const [currentMatchPlayers, setCurrentMatchPlayers] =
    useState(playersToSubscribe);
  const teamAResultInputRef = useRef();
  const teamAPlayers = match
    ? tournamentPlayers.filter((player) =>
        match.teamA.find((teamAPlayerId) => teamAPlayerId === player.id)
      )
    : [];
  const [teamA, setTeamA] = useState(match ? teamAPlayers : []);
  const teamBResultInputRef = useRef();
  const teamBPlayers = match
    ? tournamentPlayers.filter((player) =>
        match.teamB.find((teamBPlayerId) => teamBPlayerId === player.id)
      )
    : [];
  const [teamB, setTeamB] = useState(match ? teamBPlayers : []);

  useEffect(() => {
    if (isFinishedMatch) {
      setCurrentMatchPlayers(playersToSubscribe);
    }
  }, [isFinishedMatch, playersToSubscribe]);

  const navigate = useNavigate();

  const typeOptions = Array.from({ length: 11 }, (_, index) => index + 1);

  const handleMatchDateChange = (event) => {
    const inputDate = event.target.value;
    setMatchDate(inputDate);
    if (matchSubscriptionDate && inputDate <= matchSubscriptionDate) {
      setMatchSubscriptionDate(inputDate);
      setMatchSubscriptionTime(matchTime);
    }
  };

  const handleMatchTimeChange = (event) => {
    const inputTime = event.target.value;
    setMatchTime(inputTime);
    if (
      matchSubscriptionTime &&
      matchDate === matchSubscriptionDate &&
      matchSubscriptionTime > inputTime
    ) {
      setMatchSubscriptionTime(inputTime);
    }
  };

  const handleSubscriptionStartsImmediately = () => {
    setIsSubscriptionStartsImmediatelySelected(true);
    setMatchSubscriptionDate('');
    setMatchSubscriptionTime('');
  };

  const handleSubscriptionStartsCustomized = () => {
    if (!matchDate || !matchTime) {
      alert(
        'If you want to customize the subscription start, you must first specify the date and time of the match!'
      );
      return;
    }
    setIsSubscriptionStartsImmediatelySelected(false);
  };

  const handleMatchSubscriptionDateChange = (event) => {
    const inputDate = event.target.value;
    setMatchSubscriptionDate(inputDate);
    if (inputDate === matchDate && matchSubscriptionTime > matchTime) {
      setMatchSubscriptionTime(matchTime);
    }

    // this check should be overkill since I have a max={matchDate} attribute set on <input name='match-subscription-date'>
    // if (inputDate > matchDate) {
    //   setMatchSubscriptionDate(matchDate);
    // } else {
    //   setMatchSubscriptionDate(inputDate);
    // }
  };

  const handleMatchSubscriptionTimeChange = (event) => {
    const inputTime = event.target.value;
    const maxTime = matchSubscriptionDate === matchDate ? matchTime : inputTime;
    if (inputTime > maxTime) {
      setMatchSubscriptionTime(maxTime);
    } else {
      setMatchSubscriptionTime(inputTime);
    }
  };

  const handleAddPlayerToThisMatch = (player) => {
    setPlayersToSubscribe((prevState) => [...prevState, player]);
    setTournamentAvailablePlayers((prevState) =>
      prevState.filter(
        (tournamentAvailablePlayer) =>
          tournamentAvailablePlayer.id !== player.id
      )
    );
  };

  const handleDeletePlayerFromThisMatch = (player) => {
    setTournamentAvailablePlayers((prevState) => [...prevState, player]);
    setPlayersToSubscribe((prevState) =>
      prevState.filter((matchPlayer) => matchPlayer.id !== player.id)
    );
  };

  const handleAddTeamAPlayer = (player) => {
    if (teamB.find((teamplayer) => teamplayer.id === player.id))
      setTeamB((prevState) =>
        prevState.filter((teamplayer) => teamplayer.id !== player.id)
      );
    setTeamA((prevState) => Array.from(new Set([...prevState, player])));
  };

  const handleAddTeamBPlayer = (player) => {
    if (teamA.find((teamplayer) => teamplayer.id === player.id))
      setTeamA((prevState) =>
        prevState.filter((teamplayer) => teamplayer.id !== player.id)
      );
    setTeamB((prevState) => Array.from(new Set([...prevState, player])));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!teamPlayerQuota) {
      alert('You must select the type of match!');
      return;
    }

    if (
      !isFinishedMatch &&
      !isSubscriptionStartsImmediatelySelected &&
      (!matchSubscriptionDate || !matchSubscriptionTime)
    ) {
      alert(
        'You must specify the date and time of the subscription or select the subscription to start immediately!'
      );
      return;
    }

    if (
      isFinishedMatch &&
      (!teamAResultInputRef.current.value ||
        !teamBResultInputRef.current.value ||
        teamA.length === 0 ||
        teamB.length === 0)
    ) {
      alert(
        'If you are creating or editing a finished match, you must specify the result and the players for both teams!'
      );
      return;
    }

    let subscriptionDateTime;
    if (isSubscriptionStartsImmediatelySelected) {
      subscriptionDateTime = new Date();
    } else {
      const subscriptionDate = matchSubscriptionDate || matchDate;
      const subscriptionTime = matchSubscriptionTime || '00:00';
      const subscriptionCombinedDateTime = `${subscriptionDate}T${subscriptionTime}`;
      subscriptionDateTime = new Date(subscriptionCombinedDateTime);
    }

    const playersIdsToSubscribe = playersToSubscribe.map((player) => player.id);

    const matchData = {
      creationDateTime: match?.creationDateTime || new Date(),
      creator: match?.creator || userPlayerProfile.id,
      admins: match?.admins || [userPlayerProfile.id],
      tournament: tournamentId,
      mvps: match?.mvps || [],

      dateTime: new Date(`${matchDate}T${matchTime}`),
      subscriptionDateTime: subscriptionDateTime,
      address: matchAddressInputRef.current.value || '',
      playerQuota: teamPlayerQuota * 2,
      players: playersIdsToSubscribe,

      teamA: isFinishedMatch ? teamA.map((player) => player.id) : [],
      teamB: isFinishedMatch ? teamB.map((player) => player.id) : [],
      result: isFinishedMatch
        ? {
            teamA: teamAResultInputRef.current.value,
            teamB: teamBResultInputRef.current.value,
          }
        : {},
    };

    if (match) {
      const newPlayersToSubscribe = playersToSubscribe.filter(
        (player) =>
          !matchPlayers.some((matchPlayer) => matchPlayer.id === player.id)
      );
      const playersToUnsubscribe = matchPlayers.filter(
        (matchPlayer) =>
          !playersToSubscribe.some((player) => player.id === matchPlayer.id)
      );
      await Promise.all(
        newPlayersToSubscribe.map((player) =>
          addMatchPlayer(tournamentId, match.id, userPlayerProfile.id, player)
        )
      );
      await Promise.all(
        playersToUnsubscribe.map((player) =>
          deleteMatchPlayer(tournamentId, match.id, player.id)
        )
      );
      await editMatch(tournamentId, match.id, matchData);
      alert(`You have successfully edited the match ${matchDate}`);
    } else {
      const newMatchId = uuidv4();
      await addMatch(tournamentId, newMatchId, matchData);
      await Promise.all(
        playersToSubscribe.map((player) =>
          addMatchPlayer(tournamentId, newMatchId, userPlayerProfile.id, player)
        )
      );
      alert(`You have successfully created the match ${matchDate}`);
    }

    navigate('..');
  };

  return (
    <form className={styles.matchForm} onSubmit={handleSubmit}>
      <fieldset className={styles.matchDateTime}>
        <div>
          <legend>Match date:</legend>
          <input
            type='date'
            onChange={handleMatchDateChange}
            name='match-date'
            value={matchDate}
            required
          />
        </div>

        <div>
          <legend>Match time:</legend>
          <input
            type='time'
            onChange={handleMatchTimeChange}
            name='match-time'
            value={matchTime}
            required
          />
        </div>
      </fieldset>

      <fieldset>
        <input
          name='match-address'
          placeholder='Address'
          defaultValue={tournament?.defaultAddress}
          ref={matchAddressInputRef}
        />
      </fieldset>

      <fieldset className={styles.type}>
        <legend>Select type of match:</legend>
        <div>
          {typeOptions.map((number) => (
            <button
              type='button'
              key={number}
              className={
                number === teamPlayerQuota ? styles.selectedTeamPlayerQuota : ''
              }
              onClick={() =>
                number == teamPlayerQuota
                  ? setTeamPlayerQuota(null)
                  : setTeamPlayerQuota(number)
              }>
              {`F${number}`}
            </button>
          ))}
        </div>
        <legend>
          {teamPlayerQuota === 1
            ? `${teamPlayerQuota} player per team`
            : teamPlayerQuota
            ? `${teamPlayerQuota} players per team`
            : 'You have not selected the type of match'}
        </legend>
      </fieldset>

      <fieldset className={styles.matchSubscriptionDateTime}>
        <legend>Match subscription starts:</legend>
        <div>
          <div
            className={
              isSubscriptionStartsImmediatelySelected
                ? styles.selectedSubscriptionDateTime
                : ''
            }
            onClick={handleSubscriptionStartsImmediately}>
            <span>Immediately</span>
          </div>

          <div
            className={
              !isSubscriptionStartsImmediatelySelected
                ? styles.selectedSubscriptionDateTime
                : ''
            }
            onClick={handleSubscriptionStartsCustomized}>
            <input
              type='date'
              onChange={handleMatchSubscriptionDateChange}
              name='match-subscription-date'
              value={matchSubscriptionDate}
              max={matchDate}
            />

            <input
              type='time'
              onChange={handleMatchSubscriptionTimeChange}
              name='match-subscription-time'
              value={matchSubscriptionTime}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.subscribePlayersToMatch}>
        <div>
          <legend>Tournament available players:</legend>
          {tournamentAvailablePlayers.length > 0 && (
            <ul>
              {tournamentAvailablePlayers.map((player) => (
                <li
                  key={player.id}
                  onClick={() => handleAddPlayerToThisMatch(player)}>
                  {player.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <legend>Players to subscribe:</legend>
          {playersToSubscribe.length > 0 && (
            <ul>
              {playersToSubscribe.map((player) => (
                <li
                  key={player.id}
                  onClick={() => handleDeletePlayerFromThisMatch(player)}>
                  {player.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>

      <fieldset className={styles.finishedMatch}>
        <button
          type='button'
          onClick={() => setIsFinishedMatch((prevState) => !prevState)}>
          {isFinishedMatch
            ? 'This match has not been played yet'
            : 'Add result and teams'}
        </button>
        {isFinishedMatch && (
          <>
            <div>
              <legend>Match players:</legend>
              {currentMatchPlayers.length > 0 && (
                <ul>
                  {currentMatchPlayers.map((player) => (
                    <li key={player.id}>
                      {player.displayName}
                      <button
                        type='button'
                        onClick={() => handleAddTeamAPlayer(player)}>
                        Team A
                      </button>
                      <button
                        type='button'
                        onClick={() => handleAddTeamBPlayer(player)}>
                        Team B
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.teams}>
              <div>
                <legend>Team A:</legend>
                <input
                  type='number'
                  name='result-team-a'
                  defaultValue={match?.result.teamA}
                  ref={teamAResultInputRef}
                  min={0}
                  max={100}
                />
                {teamA.length > 0 && (
                  <ul>
                    {teamA.map((player) => (
                      <li key={player.id}>{player.displayName}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <legend>Team B:</legend>
                <input
                  type='number'
                  name='result-team-b'
                  defaultValue={match?.result.teamB}
                  ref={teamBResultInputRef}
                  min={0}
                  max={100}
                />
                {teamB.length > 0 && (
                  <ul>
                    {teamB.map((player) => (
                      <li key={player.id}>{player.displayName}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </fieldset>

      <button type='submit'>{match ? 'Update Match' : 'Create Match'}</button>
    </form>
  );
};

export default MatchForm;
