import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MatchesSection from '../../components/tournaments/matches/MatchesSection/MatchesSection';

import {
  getTournamentMatches,
  getTournament,
} from '../../utils/firebase/firestore/firestoreActions';

const MatchesPage = () => {
  const { tournamentId } = useParams();
  const [tournamentMatches, setTournamentMatches] = useState([]);
  const [tournament, setTournament] = useState({});

  useEffect(() => {
    const fetchTournamentMatches = async () => {
      const matches = await getTournamentMatches(tournamentId);
      setTournamentMatches(matches);
    };
    fetchTournamentMatches();

    const fetchTournament = async () => {
      const fetchedTournament = await getTournament(tournamentId);
      setTournament(fetchedTournament);
    };
    fetchTournament();
  }, [tournamentId]);

  return <MatchesSection matches={tournamentMatches} tournament={tournament} />;
};

export default MatchesPage;
