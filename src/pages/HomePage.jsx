import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

import HomeSection from '../components/home/HomeSection/HomeSection';

import { getUserAuthCtx } from '../context/authContext';
import { getMatchesFromTournaments } from '../utils/firebase/firestore/firestoreActions';
import bouncingBall from '../assets/bouncing-ball.json';

const HomePage = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [isLoading, setIsLoading] = useState(true);
  const [userMatches, setUserMatches] = useState([]);

  useEffect(() => {
    if (userPlayerProfile) {
      // get matches from user active tournaments:
      const fetchUserActiveTournamentsMatches = async () => {
        const fetchedMatches = await getMatchesFromTournaments(
          userPlayerProfile.tournaments.active
        );
        setUserMatches(fetchedMatches);
        setIsLoading(false);
      };
      fetchUserActiveTournamentsMatches();
    }
  }, [userPlayerProfile]);

  const content = isLoading ? (
    <Lottie animationData={bouncingBall} loop={true} />
  ) : (
    <HomeSection matches={userMatches} />
  );

  return content;
};

export default HomePage;
