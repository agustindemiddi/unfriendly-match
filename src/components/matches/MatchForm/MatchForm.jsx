import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './MatchForm.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import {
  getPlayers,
  addMatch,
  subscribeToMatch,
} from '../../../utils/firebase/firestore/firestoreActions';
import {
  getNextMatchDate,
  getNextMatchSubscriptionDate,
} from '../../../utils/getNextMatchDates';

const MatchForm = () => {
  const { tournamentId } = useParams();
  const { userPlayerProfile, updatedUserTournaments } = getUserAuthCtx();
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchSubscriptionDate, setMatchSubscriptionDate] = useState('');
  const [matchSubscriptionTime, setMatchSubscriptionTime] = useState('');
  const [
    isSubscriptionStartsImmediatelySelected,
    setIsSubscriptionStartsImmediatelySelected,
  ] = useState(true);
  const [matchPlayers, setMatchPlayers] = useState([]);
  const [tournamentAvailablePlayers, setTournamentAvailablePlayers] = useState(
    []
  );
  const [typeOfMatch, setTypeOfMatch] = useState(5);

  const matchDateInputRef = useRef();
  const matchTimeInputRef = useRef();
  const matchAddressInputRef = useRef();
  const matchSubscriptionDateInputRef = useRef();
  const matchSubscriptionTimeInputRef = useRef();

  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];

  useEffect(() => {
    tournament?.defaultMatchDay &&
      setMatchDate(getNextMatchDate(tournament.defaultMatchDay));
  }, [tournament?.defaultMatchDay]);

  useEffect(() => {
    tournament?.defaultMatchTime && setMatchTime(tournament.defaultMatchTime);
  }, [tournament?.defaultMatchTime]);

  useEffect(() => {
    tournament?.defaultPlayerQuota &&
      setTypeOfMatch(tournament.defaultPlayerQuota / 2);
  }, [tournament?.defaultPlayerQuota]);

  useEffect(() => {
    if (
      tournament?.defaultMatchDay &&
      tournament.defaultMatchSubscriptionDaysBefore
    ) {
      setMatchSubscriptionDate(
        getNextMatchSubscriptionDate(
          tournament.defaultMatchDay,
          tournament.defaultMatchSubscriptionDaysBefore
        )
      );
      setIsSubscriptionStartsImmediatelySelected(false);
    }
  }, [
    tournament?.defaultMatchDay,
    tournament?.defaultMatchSubscriptionDaysBefore,
  ]);

  useEffect(() => {
    tournament?.defaultMatchSubscriptionTime &&
      setMatchSubscriptionTime(tournament.defaultMatchSubscriptionTime);
  }, [tournament?.defaultMatchSubscriptionTime]);

  useEffect(() => {
    if (tournament) {
      const fetchPlayers = async () => {
        const playersArrayWithUserPlayer = await getPlayers(tournament.players);
        const playersArray = playersArrayWithUserPlayer.filter(
          (player) => player.id !== userPlayerProfile.id
        );
        setTournamentAvailablePlayers(playersArray);
        setMatchPlayers([userPlayerProfile]);
      };
      fetchPlayers();
    }
  }, [tournament?.players]);

  const typeOptions = Array.from({ length: 11 }, (_, index) => index + 1);

  const handleSelectType = (number) => {
    setTypeOfMatch(number);
  };

  const handleSelectSubscriptionStartsImmediately = () => {
    setIsSubscriptionStartsImmediatelySelected(true);
    setMatchSubscriptionDate('');
    setMatchSubscriptionTime('');
  };

  const handleMatchSubscriptionTimeChange = (event) => {
    const inputTime = event.target.value;
    const maxTime = matchSubscriptionDate === matchDate ? matchTime : '';

    if (inputTime > maxTime) {
      setMatchSubscriptionTime(maxTime);
    } else {
      setMatchSubscriptionTime(inputTime);
    }
  };

  const handleAddPlayerToThisMatch = (player) => {
    setMatchPlayers((prevState) => [...prevState, player]);

    setTournamentAvailablePlayers((prevState) =>
      prevState.filter(
        (tournamentAvailablePlayer) =>
          tournamentAvailablePlayer.id !== player.id
      )
    );
  };

  const handleDeletePlayerFromThisMatch = (player) => {
    setTournamentAvailablePlayers((prevState) => [...prevState, player]);

    setMatchPlayers((prevState) =>
      prevState.filter((matchPlayer) => matchPlayer.id !== player.id)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const date = matchDateInputRef.current.value;
    const time = matchTimeInputRef.current.value;
    const combinedDateTime = `${date}T${time}`;
    const dateTime = new Date(combinedDateTime);

    let subscriptionDateTime;
    if (isSubscriptionStartsImmediatelySelected) {
      subscriptionDateTime = new Date();
    } else {
      const subscriptionDate = matchSubscriptionDateInputRef.current.value;
      const subscriptionTime = matchSubscriptionTimeInputRef.current.value;
      const subscriptionCombinedDateTime = `${subscriptionDate}T${subscriptionTime}`;
      subscriptionDateTime = new Date(subscriptionCombinedDateTime);
    }

    const matchData = {
      tournament: tournamentId,
      creator: userPlayerProfile.id,
      admins: tournament.admins,
      creationDateTime: new Date(),
      subscriptionDateTime: subscriptionDateTime,
      dateTime: dateTime,
      address: matchAddressInputRef.current.value,
      playerQuota: typeOfMatch * 2,
      teamA: [],
      teamB: [],
      result: {},
      mvps: [],
    };

    const matchId = uuidv4();
    await addMatch(tournamentId, matchId, matchData);

    await Promise.all(
      matchPlayers.map((player) =>
        subscribeToMatch(tournamentId, matchId, player)
      )
    );

    console.log('match added!');
  };

  return (
    <form className={styles.matchForm} onSubmit={handleSubmit}>
      <fieldset className={styles.matchDateTime}>
        <div>
          <legend>Match day:</legend>
          <input
            type='date'
            onChange={(event) => setMatchDate(event.target.value)}
            name='match-date'
            // defaultValue={matchDate}
            value={matchDate}
            ref={matchDateInputRef}
            required
          />
        </div>

        <div>
          <legend>Match time:</legend>
          <input
            type='time'
            onChange={(event) => setMatchTime(event.target.value)}
            name='match-time'
            // defaultValue={matchTime}
            value={matchTime}
            ref={matchTimeInputRef}
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
                number === typeOfMatch ? styles.selectedTypeOfMatch : ''
              }
              onClick={() => handleSelectType(number)}>
              {`F${number}`}
            </button>
          ))}
        </div>
        <legend>{typeOfMatch} players per team</legend>
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
            onClick={handleSelectSubscriptionStartsImmediately}>
            <span>Immediately</span>
          </div>

          <div
            className={
              !isSubscriptionStartsImmediatelySelected
                ? styles.selectedSubscriptionDateTime
                : ''
            }
            onClick={() => setIsSubscriptionStartsImmediatelySelected(false)}>
            <input
              type='date'
              onChange={(event) => setMatchSubscriptionDate(event.target.value)}
              name='match-subscription-date'
              // defaultValue={matchSubscriptionDate}
              value={matchSubscriptionDate}
              max={matchDate}
              ref={matchSubscriptionDateInputRef}
            />

            <input
              type='time'
              onChange={handleMatchSubscriptionTimeChange}
              name='match-subscription-time'
              // defaultValue={matchSubscriptionTime}
              value={matchSubscriptionTime}
              ref={matchSubscriptionTimeInputRef}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.subscribePlayersToMatch}>
        <legend> Subscribe players to this match:</legend>
        {matchPlayers && (
          <ul>
            {matchPlayers.map((player) => (
              <li
                key={player.id}
                onClick={() => handleDeletePlayerFromThisMatch(player)}>
                {player.displayName}
              </li>
            ))}
          </ul>
        )}

        <legend> Available players:</legend>
        {tournamentAvailablePlayers && (
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
      </fieldset>

      <button type='submit'>Create Match</button>
    </form>
  );
};

export default MatchForm;
