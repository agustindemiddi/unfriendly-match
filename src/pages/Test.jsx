import { useState } from 'react';

import { collection, doc, getDoc } from 'firebase/firestore';

import db from '../utils/firebase/firebaseConfig';
import { getUserAuthCtx } from '../context/AuthContext';

const Test = () => {
  const [match, setMatch] = useState({});
  const [matchCreator, setMatchCreator] = useState({});
  const [matchAdmin, setMatchAdmin] = useState({});

  //   const { userPlayerProfile } = getUserAuthCtx();

  // const matchesCollectionRef = collection(db, 'matches');

  const test = async () => {
    const testMatchDocumentRef = doc(
      db,
      'tournaments/0zVJNHCdGU0eSWHIwefk/matches/MA0ttT7l0DFBtcCLBrGK'
    );

    const docSnap = await getDoc(testMatchDocumentRef);

    if (docSnap.exists()) {
      //   console.log('Document data:', docSnap.data());
      setMatch(docSnap.data());
      console.log('Match:', docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  const test2 = async () => {
    const matchCreatorDocumentRef = match.creator;
    console.log('Creator:', matchCreatorDocumentRef);

    const docSnap = await getDoc(matchCreatorDocumentRef);

    if (docSnap.exists()) {
      //   console.log('Document data:', docSnap.data());
      setMatchCreator(docSnap.data());
      console.log('Match Creator:', docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log('No such document!');
    }

    const matchAdminId = match.admins[0];
    const matchAdminIdDocumentRef = doc(db, `players/${matchAdminId}`);
    console.log('Admin:', matchAdminIdDocumentRef);

    const docSnap2 = await getDoc(matchAdminIdDocumentRef);

    if (docSnap2.exists()) {
      //   console.log('Document data:', docSnap2.data());
      setMatchAdmin(docSnap2.data());
      console.log('Match Creator:', docSnap2.data());
    } else {
      // docSnap2.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  return (
    <section>
      <button onClick={test}>FETCH-TEST</button>
      <button onClick={test2}>try to extract creator object data</button>
    </section>
  );
};

export default Test;
