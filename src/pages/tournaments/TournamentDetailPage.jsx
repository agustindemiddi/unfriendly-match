import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TournamentDetailSection from '../../components/tournaments/TournamentDetailSection/TournamentDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
import { addTournamentListener } from '../../utils/firebase/firestore/firestoreActions';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams();
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedActiveTournamentsMatches,
  } = getUserAuthCtx();
  const [unsubscribedTournament, setUnsubscribedTournament] = useState([]);

  const tournament = updatedUserTournaments?.all?.find(
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

  return (
    <>
      {userPlayerProfile &&
        updatedUserTournaments &&
        updatedActiveTournamentsMatches && (
          <TournamentDetailSection
            tournament={tournament || unsubscribedTournament}
            matches={updatedActiveTournamentsMatches}
            userPlayerProfile={userPlayerProfile}
          />
        )}
    </>
  );
};

export default TournamentDetailPage;
