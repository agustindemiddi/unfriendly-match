import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TournamentPlayersSection from '../../components/Tournaments/TournamentPlayers/TournamentPlayersSection';

import {
  getTournament,
  getPlayers,
} from '../../utils/firebase/firestore/firestoreActions';

const TournamentPlayersPage = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState([]);
  const [tournamentPlayers, setTournamentPlayers] = useState([]);

  useEffect(() => {
    const fetchTournamentPlayers = async () => {
      const fetchedTournament = await getTournament(tournamentId);
      setTournament(fetchedTournament);

      const players = await getPlayers(fetchedTournament.players);
      setTournamentPlayers(players);
    };
    fetchTournamentPlayers();
  }, [tournamentId]);

  return (
    <TournamentPlayersSection
      tournament={tournament}
      players={tournamentPlayers}
    />
  );
};

export default TournamentPlayersPage;
