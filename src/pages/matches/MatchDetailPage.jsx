import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import Section from '../../components/UI/Section';
import MatchDetail from '../../components/matches/MatchDetail/MatchDetail';

import db from '../../utils/firebase/firebaseConfig';
import { createMatchObjectFromFirestore } from '../../utils/firebase/firestore/firestoreActions';

const MatchDetailPage = () => {
  const { tournamentId, matchId } = useParams();
  const [match, setMatch] = useState();

  useEffect(() => {
    const fetchMatch = async () => {
      const docRef = doc(db, `tournaments/${tournamentId}/matches/${matchId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMatch(createMatchObjectFromFirestore(docSnap));
      } else {
        console.log('No such document!');
      }
    };

    fetchMatch();
  }, [tournamentId, matchId]);

  return <Section>{match && <MatchDetail match={match} />}</Section>;
};

export default MatchDetailPage;
