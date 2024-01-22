import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TournamentDetailSection from '../../components/tournaments/TournamentDetailSection/TournamentDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
import { getTournament } from '../../utils/firebase/firestore/firestoreActions';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams();
  const { updatedUserTournaments, updatedTournamentMatches } = getUserAuthCtx();
  const [unsubscribedTournament, setUnsubscribedTournament] = useState([]);

  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];

  useEffect(() => {
    if (!tournament) {
      const fetchTournament = async () => {
        const fetchedTournament = await getTournament(tournamentId);
        setUnsubscribedTournament(fetchedTournament);
      };
      fetchTournament();
    }
  }, [tournamentId]);

  return (
    <>
      {updatedUserTournaments && updatedTournamentMatches && (
        <TournamentDetailSection
          tournament={tournament || unsubscribedTournament}
          matches={updatedTournamentMatches}
        />
      )}
    </>
  );
};

export default TournamentDetailPage;
