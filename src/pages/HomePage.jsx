import { useState, useEffect } from 'react';

import HomeSection from '../components/home/HomeSection/HomeSection';

import { getUserAuthCtx } from '../context/authContext';
// import { getMatchesFromTournaments } from '../utils/firebase/firestore/firestoreActions';
import LoadingBouncingSoccerBall from '../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const HomePage = () => {
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedActiveTournamentsMatches,
  } = getUserAuthCtx();
  // userPlayerProfile, tournament, match
  // const [isLoading, setIsLoading] = useState(true);
  // const [userMatches, setUserMatches] = useState([]);

  // useEffect(() => {
  //   if (userPlayerProfile?.tournaments.active.length > 0) {
  //     // get matches from user active tournaments:
  //     const fetchUserActiveTournamentsMatches = async () => {
  //       const fetchedMatches = await getMatchesFromTournaments(
  //         userPlayerProfile.tournaments.active
  //       );
  //       setUserMatches(fetchedMatches);
  //     };
  //     fetchUserActiveTournamentsMatches();
  //   }
  //   setIsLoading(false);
  // }, [userPlayerProfile?.tournaments.active]);

  let isLoading = true;
  if (
    userPlayerProfile &&
    updatedUserTournaments &&
    updatedActiveTournamentsMatches.length > 0
  )
    isLoading = false;

  return (
    <>
      {/* {userPlayerProfile &&
        updatedUserTournaments &&
        updatedActiveTournamentsMatches && (
          <HomeSection
            userPlayerProfile={userPlayerProfile}
            tournaments={updatedUserTournaments}
            matches={updatedActiveTournamentsMatches}
          />
        )} */}
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
