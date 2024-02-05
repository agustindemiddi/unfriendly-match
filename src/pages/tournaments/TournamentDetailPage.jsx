import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TournamentDetailSection from '../../components/tournaments/TournamentDetailSection/TournamentDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
import { addTournamentListener } from '../../utils/firebase/firestore/firestoreActions';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams();
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedActiveTournamentsMatches,
    updatedUserTournamentsPlayers,
  } = getUserAuthCtx();
  const [unsubscribedTournament, setUnsubscribedTournament] = useState(null);

  const tournament = updatedUserTournaments.all.find(
    (tournament) => tournament.id === tournamentId
  );

  useEffect(() => {
    if (!tournament) {
      const unsubscribe = addTournamentListener(
        tournamentId,
        setUnsubscribedTournament
      );
      return () => unsubscribe();
    } else {
      setUnsubscribedTournament([]);
    }
  }, [tournamentId]);

  const tournamentMatches = updatedActiveTournamentsMatches.filter(
    (match) => match.tournament === tournamentId
  );

  let isLoading = true;
  if (
    userPlayerProfile &&
    (tournament || unsubscribedTournament) &&
    updatedUserTournamentsPlayers.length > 0
  )
    isLoading = false;

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <TournamentDetailSection
          userPlayerProfile={userPlayerProfile}
          tournament={tournament || unsubscribedTournament}
          matches={tournamentMatches}
          players={updatedUserTournamentsPlayers}
        />
      )}
    </>
  );
};

export default TournamentDetailPage;
