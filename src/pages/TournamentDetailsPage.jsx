import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import TournamentItem from '../components/Tournaments/TournamentItem';

import TournamentDetailsItem from '../components/Tournaments/TournamentDetailsItem';

import db from '../utils/firebaseConfig';

const TournamentDetailsPage = () => {
  const [tournament, setTournament] = useState({});
  const params = useParams();

  useEffect(
    () => async () => {
      const docRef = doc(db, 'tournaments', params.tournamentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTournament(docSnap.data());
      } else {
        console.error('Tournament not found!');
      }
    },
    []
  );

  return (
    <>
      <TournamentDetailsItem item={tournament} />
      {/* <TournamentItem item={tournament} /> */}
    </>
  );
};

export default TournamentDetailsPage;
