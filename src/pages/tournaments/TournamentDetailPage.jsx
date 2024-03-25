import TournamentDetailSection from '../../components/tournaments/TournamentDetailSection/TournamentDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const TournamentDetailPage = () => {
  const {
    userPlayerProfile,
    updatedTournament,
    updatedTournamentMatches,
    updatedTournamentPlayers,
  } = getUserAuthCtx();

  let isLoading = true;
  if (
    userPlayerProfile &&
    updatedTournament &&
    updatedTournamentPlayers.length > 0
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
          players={updatedTournamentPlayers}
        />
      )}
    </>
  );
};

export default TournamentDetailPage;
