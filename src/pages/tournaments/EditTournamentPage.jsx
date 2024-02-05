import { useParams } from 'react-router-dom';

import EditTournamentSection from '../../components/tournaments/EditTournamentSection/EditTournamentSection';

import { getUserAuthCtx } from '../../context/authContext';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const EditTournamentPage = () => {
  const { tournamentId } = useParams();
  const { userPlayerProfile, updatedUserTournaments } = getUserAuthCtx();
  const tournament = updatedUserTournaments.all.find(
    (tournament) => tournament.id === tournamentId
  );

  let isLoading = true;
  if (userPlayerProfile && tournament) isLoading = false;

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <EditTournamentSection
          userPlayerProfile={userPlayerProfile}
          tournament={tournament}
        />
      )}
    </>
  );
};

export default EditTournamentPage;
