import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';

import { getUserAuthCtx } from '../context/AuthContext';
import db from '../utils/firebase/firebaseConfig';

import Home from '../components/Home/Home';

import createMatchObjectFromFirestore from '../utils/firebase/firestore/createMatchObjectFromFirestore';

const HomePage = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [userMatches, setUserMatches] = useState([]);

  // get all user active tournaments matches >>>
  useEffect(() => {
    if (userPlayerProfile) {
      const fetchData = async () => {
        const userMatchesInActiveTournamentsArray = await Promise.all(
          userPlayerProfile.activeTournaments.map(async (tournamentId) => {
            const querySnapshot = await getDocs(
              collection(db, 'tournaments', tournamentId, 'matches')
            );
            const matchesArray = querySnapshot.docs.map((matchDoc) =>
              createMatchObjectFromFirestore(matchDoc)
            );
            return matchesArray;
          })
        );
        setUserMatches(userMatchesInActiveTournamentsArray.flat());
      };

      fetchData();
    }
  }, [userPlayerProfile]);
  // get all user active tournaments matches (end) <<<

  return <Home userMatches={userMatches} />;
};

export default HomePage;
