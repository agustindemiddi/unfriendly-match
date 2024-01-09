import { useState, useEffect } from 'react';

import HomeSection from '../components/home/HomeSection/HomeSection';

import { getUserAuthCtx } from '../context/authContext';
import { getMatchesFromTournaments } from '../utils/firebase/firestore/firestoreActions';

const HomePage = () => {
  const { updatedUserPlayerProfile } = getUserAuthCtx();
  const [isLoading, setIsLoading] = useState(true);
  const [userMatches, setUserMatches] = useState([]);

  useEffect(() => {
    if (updatedUserPlayerProfile?.tournaments.active.length > 0) {
      // get matches from user active tournaments:
      const fetchUserActiveTournamentsMatches = async () => {
        const fetchedMatches = await getMatchesFromTournaments(
          updatedUserPlayerProfile.tournaments.active
        );
        setUserMatches(fetchedMatches);
      };
      fetchUserActiveTournamentsMatches();
    }
    setIsLoading(false);
  }, [updatedUserPlayerProfile?.tournaments.active]);

  return <HomeSection matches={userMatches} isLoading={isLoading} />;
};

export default HomePage;
