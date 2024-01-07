import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import EditTournamentSection from '../../components/tournaments/EditTournamentSection/EditTournamentSection';

import { getTournament } from '../../utils/firebase/firestore/firestoreActions';

const EditTournamentPage = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState({});

  useEffect(() => {
    // get tournament:
    const fetchTournament = async () => {
      const fetchedTournament = await getTournament(tournamentId);
      setTournament(fetchedTournament);
    };
    fetchTournament();
  }, [tournamentId]);

  return <EditTournamentSection tournament={tournament} />;
};
export default EditTournamentPage;
