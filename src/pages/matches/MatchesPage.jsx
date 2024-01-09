import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MatchesSection from '../../components/tournaments/matches/MatchesSection/MatchesSection';

import { getUserAuthCtx } from '../../context/authContext';
import { getTournamentMatches } from '../../utils/firebase/firestore/firestoreActions';

const MatchesPage = () => {
  const { tournamentId } = useParams();
  const { updatedUserTournaments } = getUserAuthCtx();
  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];
  const [tournamentMatches, setTournamentMatches] = useState([]);

  useEffect(() => {
    const fetchTournamentMatches = async () => {
      const matches = await getTournamentMatches(tournamentId);
      setTournamentMatches(matches);
    };
    fetchTournamentMatches();
  }, [tournamentId]);

  return <MatchesSection matches={tournamentMatches} tournament={tournament} />;
};

export default MatchesPage;
