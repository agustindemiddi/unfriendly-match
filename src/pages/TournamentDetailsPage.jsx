import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import PageContent from '../components/UI/PageContent';
import TournamentItem from '../components/TournamentItem';

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
        console.log('No such document!');
      }
    },
    []
  );

  return (
    <PageContent title='TournamentDetailsPage'>
      <TournamentItem item={tournament} />
    </PageContent>
  );
};

export default TournamentDetailsPage;
