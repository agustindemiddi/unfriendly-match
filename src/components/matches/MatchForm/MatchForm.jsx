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
  const [typeOfMatch, setTypeOfMatch] = useState(null);

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

    tournament?.defaultMatchTime && setMatchTime(tournament.defaultMatchTime);

    tournament?.defaultPlayerQuota &&
      setTypeOfMatch(tournament.defaultPlayerQuota / 2);

    if (
      tournament?.defaultMatchDay &&
      (tournament.defaultMatchSubscriptionDaysBefore ||
        tournament?.defaultMatchSubscriptionDaysBefore === 0)
    ) {
      setIsSubscriptionStartsImmediatelySelected(false);
      setMatchSubscriptionDate(
        getNextMatchSubscriptionDate(
          tournament.defaultMatchDay,
          tournament.defaultMatchSubscriptionDaysBefore
        )
      );
    }

    if (tournament?.defaultMatchSubscriptionTime) {
      setIsSubscriptionStartsImmediatelySelected(false);
      setMatchSubscriptionTime(tournament.defaultMatchSubscriptionTime);
    }

    if (tournament?.players) {
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
  }, [
    tournament?.defaultMatchDay,
    tournament?.defaultMatchTime,
    tournament?.defaultPlayerQuota,
    tournament?.defaultMatchSubscriptionDaysBefore,
    tournament?.defaultMatchSubscriptionTime,
    tournament?.players,
  ]);

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

    if (!typeOfMatch) {
      alert('You must select the type of match!');
      return;
    }

    const date = matchDateInputRef.current.value;
    const time = matchTimeInputRef.current.value;
    const combinedDateTime = `${date}T${time}`;
    const dateTime = new Date(combinedDateTime);

    let subscriptionDateTime;
    if (isSubscriptionStartsImmediatelySelected) {
      subscriptionDateTime = new Date();
    } else {
      // const subscriptionDate = matchSubscriptionDateInputRef.current.value;
      const subscriptionDate = matchSubscriptionDate || matchDate;
      // const subscriptionTime = matchSubscriptionTimeInputRef.current.value;
      const subscriptionTime = matchSubscriptionTime || '00:00';
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
      address: matchAddressInputRef.current.value || '',
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
          <legend>Match date:</legend>
          <input
            type='date'
            onChange={handleMatchDateChange}
            name='match-date'
            value={matchDate}
            ref={matchDateInputRef}
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
              onClick={() =>
                number == typeOfMatch
                  ? setTypeOfMatch(null)
                  : setTypeOfMatch(number)
              }>
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
              ref={matchSubscriptionDateInputRef}
            />

            <input
              type='time'
              onChange={handleMatchSubscriptionTimeChange}
              name='match-subscription-time'
              value={matchSubscriptionTime}
              ref={matchSubscriptionTimeInputRef}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.subscribePlayersToMatch}>
        <div>
          <legend> Subscribe players to this match:</legend>
          {matchPlayers.length > 0 && (
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

      <button type='submit'>Create Match</button>
    </form>
  );
};

export default MatchForm;
