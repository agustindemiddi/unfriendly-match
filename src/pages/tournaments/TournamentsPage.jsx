import { useState, useEffect } from 'react';

import TournamentsSection from '../../components/Tournaments/TournamentsSection';

import { getUserAuthCtx } from '../../context/AuthContext';
import { getUserTournaments } from '../../utils/firebase/firestore/firestoreActions';

const TournamentsPage = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [userTournaments, setUserTournaments] = useState([]);

  // get user tournaments:
  useEffect(() => {
    if (userPlayerProfile?.tournaments.all.length > 0) {
      const fetch = async () => {
        const response = await getUserTournaments(
          userPlayerProfile.tournaments.all
        );
        setUserTournaments(response);
      };
      fetch();
    }
  }, [userPlayerProfile]);

  return <TournamentsSection tournaments={userTournaments} />;
};

export default TournamentsPage;
