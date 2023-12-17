import { useState, useEffect } from 'react';

import Home from '../components/Home/Home';

import { getUserAuthCtx } from '../context/AuthContext';

import { getUserActiveTournamentsMatches } from '../utils/firebase/firestore/firestoreActions';

const HomePage = () => {
  const [userMatches, setUserMatches] = useState([]);
  const { userPlayerProfile } = getUserAuthCtx();

  // get user active tournaments matches:
  useEffect(() => {
    if (userPlayerProfile)
      getUserActiveTournamentsMatches(userPlayerProfile, setUserMatches);
  }, [userPlayerProfile]);

  return <Home userMatches={userMatches} />;
};

export default HomePage;
