import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MatchesSection from '../../components/matches/MatchesSection/MatchesSection';

import { getUserAuthCtx } from '../../context/authContext';
import { getTournament } from '../../utils/firebase/firestore/firestoreActions';

const MatchesPage = () => {
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
      {updatedTournamentMatches && (
        <MatchesSection
          matches={updatedTournamentMatches}
          tournament={tournament || unsubscribedTournament}
        />
      )}
    </>
  );
};

export default MatchesPage;
