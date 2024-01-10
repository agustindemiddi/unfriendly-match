import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import styles from './MatchForm.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import {
  getPlayers,
  addMatch,
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

  const handleSubmit = (e) => {
    e.preventDefault();

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

    const currentDateTime = new Date();

    const playersRefs = matchPlayers.map((player) => player.id);

    // const players = matchPlayers.map((player) => ({
    //   id: player.id,
    //   subscriptionDateTime: currentDateTime,
    //   subscribedBy: userPlayerProfile.id,
    // }));

    const matchData = {
      tournament: tournamentId,
      creator: userPlayerProfile.id,
      admins: tournament.admins,
      creationDateTime: currentDateTime,
      subscriptionDateTime: matchSubscriptionDateTime, // custom or Timestamp.now() (default value)
      dateTime: matchDateTime,
      address: matchAddressInputRef.current.value,
      playerQuota: playerQuotaInputRef.current.value * 2,
      players: playersRefs,
      teamA: [],
      teamB: [],
      result: {},
      mvps: [],
    };

    addMatch(tournamentId, matchData);
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
                {player.username}
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
                {player.username}
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
