import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import Section from '../../components/UI/Section';
import ContactDetail from '../../components/Contacts/ContactDetail/ContactDetail';

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

  return (
    <Section>
      <button onClick={() =>   console.log(params)}>click</button>
      <ContactDetail item={player} />
    </Section>
  );
};

export default ContactDetailPage;
