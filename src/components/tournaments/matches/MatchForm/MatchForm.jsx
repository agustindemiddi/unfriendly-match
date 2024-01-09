import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  query,
  where,
  documentId,
  getDocs,
  addDoc,
  collection,
  Timestamp,
} from 'firebase/firestore';

import styles from './MatchForm.module.css';

import db from '../../../../utils/firebase/firebaseConfig';
import { getUserAuthCtx } from '../../../../context/authContext';

const MatchForm = () => {
  const { tournamentId } = useParams();
  const { updatedUserPlayerProfile, updatedUserTournaments } = getUserAuthCtx();
  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];
  const [tournamentAvailablePlayers, setTournamentAvailablePlayers] = useState(
    []
  );
  const [matchPlayers, setMatchPlayers] = useState([]);
  const matchDateInputRef = useRef();
  const matchTimeInputRef = useRef();
  const matchAddressInputRef = useRef();
  const matchSubscriptionStartDateInputRef = useRef();
  const matchSubscriptionStartTimeInputRef = useRef();
  const playerQuotaInputRef = useRef();

  useEffect(() => {
    if (tournament) {
      const fetchData = async () => {
        const q = query(
          collection(db, 'players'),
          where(documentId(), 'in', tournament.players)
        );
        const querySnapshot = await getDocs(q);

        const tournamentPlayersArrayWithUserPlayer = [];
        querySnapshot.forEach((doc) => {
          const player = { ...doc.data(), id: doc.id };
          tournamentPlayersArrayWithUserPlayer.push(player);
        });
        const tournamentPlayersArray =
          tournamentPlayersArrayWithUserPlayer.filter(
            (player) => player.id !== updatedUserPlayerProfile?.id
          );
        setTournamentAvailablePlayers(tournamentPlayersArray);

        setMatchPlayers([updatedUserPlayerProfile]);
      };

      fetchData();
    }
  }, [tournament]);

  const addMatch = async (matchData) => {
    const docRef = await addDoc(
      collection(db, 'tournaments', tournamentId, 'matches'),
      matchData
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const matchDate = matchDateInputRef.current.value;
    const matchTime = matchTimeInputRef.current.value;
    const matchCombinedDateTime = `${matchDate}T${matchTime}`;
    // Timestamp.fromDate() doesn't seem to be needed. Try to add from other part of the world and compare.
    const matchDateTime = Timestamp.fromDate(new Date(matchCombinedDateTime));

    const matchSubscriptionDate =
      matchSubscriptionStartDateInputRef.current.value;
    const matchSubscriptionTime =
      matchSubscriptionStartTimeInputRef.current.value;
    const matchSubscriptionCombinedDateTime = `${matchSubscriptionDate}T${matchSubscriptionTime}`;
    // Timestamp.fromDate() doesn't seem to be needed. Try to add from other part of the world and compare.
    const matchSubscriptionDateTime = Timestamp.fromDate(
      new Date(matchSubscriptionCombinedDateTime)
    );

    const playersRefs = matchPlayers.map((player) => player.id);

    const matchData = {
      tournament: tournamentId,
      creator: updatedUserPlayerProfile.id,
      admins: [...new Set([...tournament.admins, updatedUserPlayerProfile.id])],
      creationDateTime: Timestamp.now(),
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

    addMatch(matchData);
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
