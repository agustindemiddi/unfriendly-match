import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MatchesSection from '../../components/matches/MatchesSection/MatchesSection';

import { getUserAuthCtx } from '../../context/authContext';
import { getTournament } from '../../utils/firebase/firestore/firestoreActions';

const MatchesPage = () => {
  const { tournamentId } = useParams();
  const { updatedUserTournaments, updatedActiveTournamentsMatches } =
    getUserAuthCtx();
  const [unsubscribedTournament, setUnsubscribedTournament] = useState([]);

  const tournament = updatedUserTournaments?.all?.find(
    (tournament) => tournament.id === tournamentId
  );

  useEffect(() => {
    if (!tournament) {
      const fetchTournament = async () => {
        const fetchedTournament = await getTournament(tournamentId);
        setUnsubscribedTournament(fetchedTournament);
      };
      fetchTournament();
    }
  }, [tournamentId]);

  const tournamentsMatches = updatedActiveTournamentsMatches.filter(
    (match) => match.tournament === tournamentId
  );

  return (
    <>
      {updatedActiveTournamentsMatches && (
        <MatchesSection
          matches={tournamentsMatches}
          tournament={tournament || unsubscribedTournament}
        />
      )}
    </>
  );
};

export default MatchesPage;
