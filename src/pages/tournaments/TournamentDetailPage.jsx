import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TournamentDetailSection from '../../components/tournaments/TournamentDetailSection/TournamentDetailSection';

import {
  getTournament,
  getTournamentMatches,
} from '../../utils/firebase/firestore/firestoreActions';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams();
  const [tournamentMatches, setTournamentMatches] = useState([]);
  const [tournament, setTournament] = useState({});

  useEffect(() => {
    // get tournament matches:
    const fetchTournamentMatches = async () => {
      const matches = await getTournamentMatches(tournamentId);
      setTournamentMatches(matches);
    };
    fetchTournamentMatches();

    // get tournament:
    const fetchTournament = async () => {
      const fetchedTournament = await getTournament(tournamentId);
      setTournament(fetchedTournament);
    };
    fetchTournament();
  }, [tournamentId]);

  return (
    <TournamentDetailSection
      tournament={tournament}
      matches={tournamentMatches}
      setTournament={setTournament}
    />
  );
};

export default TournamentDetailPage;
