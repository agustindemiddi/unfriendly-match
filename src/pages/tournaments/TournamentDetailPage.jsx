import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TournamentDetailSection from '../../components/tournaments/TournamentDetailSection/TournamentDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
import { getTournament } from '../../utils/firebase/firestore/firestoreActions';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams();
  const { updatedUserTournaments, tournamentMatches } = getUserAuthCtx();
  const subscribedTournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];
  const [tournament, setTournament] = useState([]);

  useEffect(() => {
    if (!subscribedTournament) {
      const fetchTournament = async () => {
        const fetchedTournament = await getTournament(tournamentId);
        setTournament(fetchedTournament);
      };
      fetchTournament();
    }
  }, [tournamentId]);

  return (
    <>
      {updatedUserTournaments && tournamentMatches && (
        <TournamentDetailSection
          tournament={subscribedTournament || tournament}
          matches={tournamentMatches}
        />
      )}
    </>
  );
};

export default TournamentDetailPage;
