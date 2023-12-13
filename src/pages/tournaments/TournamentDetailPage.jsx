import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

import Section from '../../components/UI/Section';
import TournamentDetail from '../../components/tournaments/TournamentDetail/TournamentDetail';

import db from '../../utils/firebase/firebaseConfig';

const TournamentDetailPage = () => {
  const [tournament, setTournament] = useState({});
  const [matches, setMatches] = useState([]);
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

  useEffect(
    () => async () => {
      const querySnapshot = await getDocs(
        collection(db, 'tournaments', params.tournamentId, 'matches')
      );

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setMatches((prevState) => [doc.data(), ...prevState]);
        // console.log(doc.id, ' => ', doc.data());
      });
    },
    []
  );

  return (
    <Section>
      <TournamentDetail tournament={tournament} matches={matches} />
    </Section>
  );
};

export default TournamentDetailPage;
