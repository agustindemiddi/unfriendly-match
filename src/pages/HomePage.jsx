import HomeSection from '../components/home/HomeSection/HomeSection';

import { getUserAuthCtx } from '../context/authContext';
import LoadingBouncingSoccerBall from '../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const HomePage = () => {
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedUserActiveTournamentsMatches,
  } = getUserAuthCtx();

  // this will change for (new) users without tournaments n/or matches yet
  let isLoading = true;
  if (
    userPlayerProfile &&
    updatedUserTournaments.all.length > 0 &&
    updatedUserActiveTournamentsMatches.length > 0
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
          matches={updatedUserActiveTournamentsMatches}
        />
      )}
    </>
  );
};

export default HomePage;
