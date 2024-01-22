import { useState, useRef } from 'react';
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
  getNextMatchDate,
  getNextMatchSubscriptionDate,
} from '../../../utils/getNextMatchDates';
import {
  getInputFormattedDate,
  getInputFormattedTime,
} from '../../../utils/getTerminationDates';

const MatchForm = ({
  userPlayerProfile,
  tournament,
  // tournamentPlayers,
  match,
  matchPlayers,
  availablePlayers,
}) => {
  const { tournamentId } = useParams();
  const [matchDate, setMatchDate] = useState(
    match?.dateTime
      ? getInputFormattedDate(match.dateTime)
      : tournament?.defaultMatchDay
      ? getNextMatchDate(tournament.defaultMatchDay)
      : ''
  );
  const [matchTime, setMatchTime] = useState(
    match?.dateTime
      ? getInputFormattedTime(match.dateTime)
      : tournament?.defaultMatchTime
      ? tournament.defaultMatchTime
      : ''
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
      ? getNextMatchSubscriptionDate(
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!teamPlayerQuota) {
      alert('You must select the type of match!');
      return;
    }

    if (
      // later add conditional if (!isMatchEnded &&)
      !isSubscriptionStartsImmediatelySelected &&
      (!matchSubscriptionDate || !matchSubscriptionTime)
    ) {
      alert(
        'You must specify the date and time of the subscription or select the subscription to start immediately!'
      );
      return;
    }

    let subscriptionDateTime;
    // later add conditional if (isMatchEnded) {
    // subscriptionDateTime = null
    // } else if...
    if (
      // later add conditional if (!isMatchEnded &&)
      isSubscriptionStartsImmediatelySelected
    ) {
      subscriptionDateTime = new Date();
      // maybe I need an else if if adding isMatchEnded conditional
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
      tournament: tournamentId,

      dateTime: new Date(`${matchDate}T${matchTime}`),
      subscriptionDateTime: subscriptionDateTime,
      address: matchAddressInputRef.current.value || '',
      playerQuota: teamPlayerQuota * 2,
      players: playersIdsToSubscribe,

      teamA: [],
      teamB: [],
      result: {},
      mvps: [],
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
          addMatchPlayer(tournamentId, match.id, player, userPlayerProfile.id)
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
          addMatchPlayer(tournamentId, newMatchId, player, userPlayerProfile.id)
        )
      );
      alert(`You have successfully created the match ${matchDate}`);
    }
    console.log('matchData:', matchData);
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

        <div>
          <legend> Available players:</legend>
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
      </fieldset>

      <button type='submit'>{match ? 'Update Match' : 'Create Match'}</button>
    </form>
  );
};

export default MatchForm;
