import HomeSection from '../components/home/HomeSection/HomeSection';

import { getUserAuthCtx } from '../context/authContext';
import LoadingBouncingSoccerBall from '../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const HomePage = () => {
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedActiveTournamentsMatches,
  } = getUserAuthCtx();

  // this will change for (new) users without tournaments n/or matches yet
  let isLoading = true;
  if (
    userPlayerProfile &&
    updatedUserTournaments.all.length > 0 &&
    updatedActiveTournamentsMatches.length > 0
  )
    isLoading = false;

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <HomeSection
          userPlayerProfile={userPlayerProfile}
          tournaments={updatedUserTournaments}
          matches={updatedActiveTournamentsMatches}
        />
      )}
    </>
  );
};

export default HomePage;
