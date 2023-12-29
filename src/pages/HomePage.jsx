import { useState, useEffect } from 'react';

import HomeSection from '../components/home/HomeSection/HomeSection';

import { getUserAuthCtx } from '../context/authContext';
import { getUserActiveTournamentsMatches } from '../utils/firebase/firestore/firestoreActions';

const HomePage = () => {
  const [userMatches, setUserMatches] = useState([]);
  const { userPlayerProfile } = getUserAuthCtx();

  // get user active tournaments matches:
  useEffect(() => {
    if (userPlayerProfile) {
      const fetchUserActiveTournamentsMatches = async () => {
        const fetchedMatches = await getUserActiveTournamentsMatches(
          userPlayerProfile.tournaments.active
        );
        setUserMatches(fetchedMatches);
      };
      fetchUserActiveTournamentsMatches();
    }
  }, [userPlayerProfile]);

  return <HomeSection matches={userMatches} />;
};

export default HomePage;
