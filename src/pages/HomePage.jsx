import { useState, useEffect } from 'react';

import HomeSection from '../components/home/HomeSection/HomeSection';

import { getUserAuthCtx } from '../context/authContext';
import { getMatchesFromTournaments } from '../utils/firebase/firestore/firestoreActions';

const HomePage = () => {
  const [userMatches, setUserMatches] = useState([]);
  const { userPlayerProfile } = getUserAuthCtx();

  // get matches from user active tournaments:
  useEffect(() => {
    if (userPlayerProfile) {
      const fetchUserActiveTournamentsMatches = async () => {
        const fetchedMatches = await getMatchesFromTournaments(
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
