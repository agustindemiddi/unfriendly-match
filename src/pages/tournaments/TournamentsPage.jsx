import { useState, useEffect } from 'react';

import TournamentsSection from '../../components/tournaments/TournamentsSection/TournamentsSection';

import { getUserAuthCtx } from '../../context/authContext';
import {
  getTournaments,
} from '../../utils/firebase/firestore/firestoreActions';

const TournamentsPage = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [userTournaments, setUserTournaments] = useState([]);

  // get all user tournaments:
  useEffect(() => {
    if (userPlayerProfile) {
      const fetchAllUserTournaments = async () => {
        const fetchedTournaments = await getTournaments(
          userPlayerProfile.tournaments.all
        );
        setUserTournaments(fetchedTournaments);
      };
      fetchAllUserTournaments();
    }
  }, [userPlayerProfile]);

  return <TournamentsSection tournaments={userTournaments} />;
};

export default TournamentsPage;
