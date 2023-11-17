import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import PageContent from '../components/UI/PageContent';
import ContactItem from '../components/Contacts/ContactItem';

import db from '../utils/firebaseConfig';

const ContactDetailsPage = () => {
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
    <PageContent title='ContactDetailsPage'>
      <ContactItem item={contact} />
    </PageContent>
  );
};

export default ContactDetailsPage;
