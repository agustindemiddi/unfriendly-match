import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import Section from '../../components/UI/Section';
import ContactDetail from '../../components/contacts/ContactDetail/ContactDetail';

import db from '../../utils/firebaseConfig';

const ContactDetailPage = () => {
  const [contact, setContact] = useState({});
  const params = useParams();

  useEffect(
    () => async () => {
      const docRef = doc(db, 'players', params.contactId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContact(docSnap.data());
      } else {
        console.error('Player not found!');
      }
    },
    []
  );

  return (
    <Section>
      <ContactDetail item={contact} />
    </Section>
  );
};

export default ContactDetailPage;
