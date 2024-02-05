import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MatchesSection from '../../components/matches/MatchesSection/MatchesSection';

import { getUserAuthCtx } from '../../context/authContext';
import { getTournament } from '../../utils/firebase/firestore/firestoreActions';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const MatchesPage = () => {
  const { tournamentId } = useParams();
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedActiveTournamentsMatches,
  } = getUserAuthCtx();
  const [unsubscribedTournament, setUnsubscribedTournament] = useState(null);

  const tournament = updatedUserTournaments.all.find(
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

  let isLoading = true;
  if (
    userPlayerProfile &&
    (tournament || unsubscribedTournament) &&
    tournamentsMatches
  )
    isLoading = false;

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <MatchesSection
          userPlayerProfile={userPlayerProfile}
          tournament={tournament || unsubscribedTournament}
          matches={tournamentsMatches}
        />
      )}
    </>
  );
};

export default MatchesPage;
