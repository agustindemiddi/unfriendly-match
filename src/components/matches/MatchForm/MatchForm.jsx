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

import db from '../../../utils/firebase/firebaseConfig';
import { getUserAuthCtx } from '../../../context/AuthContext';

const MatchForm = () => {
  const [tournament, setTournament] = useState();
  const [tournamentAvailablePlayers, setTournamentAvailablePlayers] = useState(
    []
  );
  const [matchPlayers, setMatchPlayers] = useState([]);
  const matchDateInputRef = useRef();
  const matchTimeInputRef = useRef();
  const matchAddressInputRef = useRef();
  const matchRegistryStartDateInputRef = useRef();
  const matchRegistryStartTimeInputRef = useRef();
  const playerQuotaInputRef = useRef();
  const params = useParams();
  const { userPlayerProfile } = getUserAuthCtx();

  // console.log(matchPlayers);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'tournaments', params.tournamentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTournament(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!');
      }
    };

    fetchData();
  }, [params.tournamentId]);

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
            (player) => player.id !== userPlayerProfile.id
          );
        setTournamentAvailablePlayers(tournamentPlayersArray);

        setMatchPlayers([userPlayerProfile]);
      };

      fetchData();
    }
  }, [tournament]);

  const addMatch = async (matchData) => {
    const docRef = await addDoc(
      collection(db, 'tournaments', params.tournamentId, 'matches'),
      matchData
    );
    // console.log('Document written with ID: ', docRef.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const matchDate = matchDateInputRef.current.value;
    const matchTime = matchTimeInputRef.current.value;
    const matchCombinedDateTime = `${matchDate}T${matchTime}`;
    // Timestamp.fromDate() doesn't seem to be needed. Try to add from other part of the world and compare.
    const matchDateTime = Timestamp.fromDate(new Date(matchCombinedDateTime));

    const matchRegistryDate = matchRegistryStartDateInputRef.current.value;
    const matchRegistryTime = matchRegistryStartTimeInputRef.current.value;
    const matchRegistryCombinedDateTime = `${matchRegistryDate}T${matchRegistryTime}`;
    // Timestamp.fromDate() doesn't seem to be needed. Try to add from other part of the world and compare.
    const matchRegistryDateTime = Timestamp.fromDate(
      new Date(matchRegistryCombinedDateTime)
    );

    const playersRefs = matchPlayers.map((player) => player.id);

    const matchData = {
      tournament: params.tournamentId,
      creator: userPlayerProfile.id,
      admins: [userPlayerProfile.id],
      creationDateTime: Timestamp.now(),
      registryDateTime: matchRegistryDateTime, // custom or Timestamp.now() (default value)
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
          name='match-registry-date'
          ref={matchRegistryStartDateInputRef}
          required
        />
      </label>
      <label>
        Hora de comienzo del registro al partido:
        <input
          type='time'
          name='match-registry-time'
          ref={matchRegistryStartTimeInputRef}
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
