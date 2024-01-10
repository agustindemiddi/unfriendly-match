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

const MatchForm = () => {
  const { tournamentId } = useParams();
  const { userPlayerProfile, updatedUserTournaments } = getUserAuthCtx();
  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];
  const [matchPlayers, setMatchPlayers] = useState([]);
  const [tournamentAvailablePlayers, setTournamentAvailablePlayers] = useState(
    []
  );

  const matchDateInputRef = useRef();
  const matchTimeInputRef = useRef();
  const matchAddressInputRef = useRef();
  const matchSubscriptionStartDateInputRef = useRef();
  const matchSubscriptionStartTimeInputRef = useRef();
  const playerQuotaInputRef = useRef();

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
  }, [tournament]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const matchDate = matchDateInputRef.current.value;
    const matchTime = matchTimeInputRef.current.value;
    const matchCombinedDateTime = `${matchDate}T${matchTime}`;
    const matchDateTime = new Date(matchCombinedDateTime);

    const matchSubscriptionDate =
      matchSubscriptionStartDateInputRef.current.value;
    const matchSubscriptionTime =
      matchSubscriptionStartTimeInputRef.current.value;
    const matchSubscriptionCombinedDateTime = `${matchSubscriptionDate}T${matchSubscriptionTime}`;
    const matchSubscriptionDateTime = new Date(
      matchSubscriptionCombinedDateTime
    );

    const matchData = {
      tournament: tournamentId,
      creator: userPlayerProfile.id,
      admins: tournament.admins,
      creationDateTime: new Date(),
      subscriptionDateTime: matchSubscriptionDateTime, // custom or Timestamp.now() (default value)
      dateTime: matchDateTime,
      address: matchAddressInputRef.current.value,
      playerQuota: playerQuotaInputRef.current.value * 2,
      teamA: [],
      teamB: [],
      result: {},
      mvps: [],
    };

    const matchId = uuidv4();
    await addMatch(tournamentId, matchId, matchData);

    await Promise.all(
      matchPlayers.map(async (player) => {
        const playerData = {
          ...player,
          subscriptionDateTime: new Date(),
          subscribedBy: userPlayerProfile.id,
        };
        await subscribeToMatch(tournamentId, matchId, playerData);
      })
    );

    console.log('match added!');
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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Día del partido:
        <input type='date' name='match-date' ref={matchDateInputRef} required />
      </label>
      <label>
        Hora del partido:
        <input type='time' name='match-time' ref={matchTimeInputRef} required />
      </label>
      <label>
        Dirección:
        <input
          name='match-address'
          placeholder='match-address'
          ref={matchAddressInputRef}
          defaultValue={tournament ? tournament.defaultAddress : undefined}
          required
        />
      </label>
      <label>
        Día de comienzo del registro al partido:
        <input
          type='date'
          name='match-subscription-date'
          ref={matchSubscriptionStartDateInputRef}
          required
        />
      </label>
      <label>
        Hora de comienzo del registro al partido:
        <input
          type='time'
          name='match-subscription-time'
          ref={matchSubscriptionStartTimeInputRef}
          required
        />
      </label>
      <label>
        Cantidad de jugadores por equipo:
        <input
          type='number'
          ref={playerQuotaInputRef}
          min={1}
          max={11}
          defaultValue={
            tournament ? tournament.defaultPlayerQuota / 2 : undefined
          }
          required
        />
      </label>
      <label>
        Anotar jugadores a este partido:
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
      </label>

      <label>
        Jugadores disponibles:
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
      </label>

      <button type='submit'>Create Match</button>
    </form>
  );
};

export default MatchForm;
