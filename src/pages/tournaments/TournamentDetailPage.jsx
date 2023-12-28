import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import TournamentDetail from '../../components/Tournaments/TournamentDetail/TournamentDetail';

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
    <TournamentDetail tournament={tournament} matches={tournamentMatches} />
  );
};

export default TournamentDetailPage;
