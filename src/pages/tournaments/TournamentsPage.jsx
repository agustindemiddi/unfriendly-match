import { useState, useEffect } from 'react';

import TournamentsSection from '../../components/Tournaments/TournamentsSection';

import { getUserAuthCtx } from '../../context/AuthContext';

import { getUserTournaments } from '../../utils/firebase/firestore/firestoreActions';

const TournamentsPage = () => {
  const [userTournaments, setUserTournaments] = useState([]);
  const { userPlayerProfile } = getUserAuthCtx();

  // get user tournaments:
  useEffect(() => {
    if (userPlayerProfile && userPlayerProfile.tournaments) {
      const userTournamentsRefsArray = userPlayerProfile.tournaments.map(
        (tournamentId) => tournamentId
      );
      if (userTournamentsRefsArray.length > 0)
        getUserTournaments(userTournamentsRefsArray, setUserTournaments);
    }
  }, [userPlayerProfile]);

  return <TournamentsSection tournaments={userTournaments} />;
};

export default TournamentsPage;
