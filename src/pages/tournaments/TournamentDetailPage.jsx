import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import TournamentDetail from '../../components/Tournaments/TournamentDetail/TournamentDetail';

import { getTournamentMatches } from '../../utils/firebase/firestore/firestoreActions';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams();
  const [tournamentMatches, setTournamentMatches] = useState([]);

  // get tournament matches:
  useEffect(() => {
    const fetchTournamentMatches = async () => {
      const matches = await getTournamentMatches(tournamentId);
      setTournamentMatches(matches);
    };
    fetchTournamentMatches();
  }, [tournamentId]);

  return <TournamentDetail matches={tournamentMatches} />;
};

export default TournamentDetailPage;
