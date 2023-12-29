import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MatchesSection from '../../components/matches/MatchesSection/MatchesSection';

import { getTournamentMatches } from '../../utils/firebase/firestore/firestoreActions';

const MatchesPage = () => {
  const { tournamentId } = useParams();
  const [tournamentMatches, setTournamentMatches] = useState([]);

  useEffect(() => {
    const fetchTournamentMatches = async () => {
      const matches = await getTournamentMatches(tournamentId);
      setTournamentMatches(matches);
    };
    fetchTournamentMatches();
  }, [tournamentId]);

  return <MatchesSection matches={tournamentMatches} />;
};

export default MatchesPage;
