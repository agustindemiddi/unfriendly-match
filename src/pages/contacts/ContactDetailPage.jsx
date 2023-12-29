import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import ContactDetailSection from '../../components/contacts/ContactDetailSection/ContactDetailSection';

import db from '../../utils/firebase/firebaseConfig';

const ContactDetailPage = () => {
  const [player, setPlayer] = useState({});
  const params = useParams();

  useEffect(
    () => async () => {
      const docRef = doc(db, 'players', params.playerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlayer(docSnap.data());
      } else {
        console.error('Player not found!');
      }
    },
    []
  );

  return <ContactDetailSection item={player} />;
};

export default ContactDetailPage;
