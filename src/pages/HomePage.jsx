import { useState, useEffect } from 'react';

import HomeSection from '../components/home/HomeSection/HomeSection';

import { getUserAuthCtx } from '../context/authContext';
import { getMatchesFromTournaments } from '../utils/firebase/firestore/firestoreActions';

const HomePage = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [isLoading, setIsLoading] = useState(true);
  const [userMatches, setUserMatches] = useState([]);

  useEffect(() => {
    if (userPlayerProfile?.tournaments.active.length > 0) {
      // get matches from user active tournaments:
      const fetchUserActiveTournamentsMatches = async () => {
        const fetchedMatches = await getMatchesFromTournaments(
          userPlayerProfile.tournaments.active
        );
        setUserMatches(fetchedMatches);
      };
      fetchUserActiveTournamentsMatches();
    }
    setIsLoading(false);
  }, [userPlayerProfile?.tournaments.active]);

  return <HomeSection matches={userMatches} isLoading={isLoading} />;
};

export default HomePage;
