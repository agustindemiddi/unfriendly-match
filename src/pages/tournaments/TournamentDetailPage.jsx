import TournamentDetailSection from '../../components/tournaments/TournamentDetailSection/TournamentDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const TournamentDetailPage = () => {
  const {
    userPlayerProfile,
    updatedTournament,
    updatedTournamentMatches,
    updatedTournamentActivePlayers,
    updatedTournamentInactivePlayers,
  } = getUserAuthCtx();

  let isLoading = true;
  if (
    userPlayerProfile &&
    updatedTournament &&
    updatedTournamentActivePlayers.length > 0
  )
    isLoading = false;

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <TournamentDetailSection
          userPlayerProfile={userPlayerProfile}
          tournament={updatedTournament}
          matches={updatedTournamentMatches}
          activePlayers={updatedTournamentActivePlayers}
          inactivePlayers={updatedTournamentInactivePlayers}
        />
      )}
    </>
  );
};

export default TournamentDetailPage;
