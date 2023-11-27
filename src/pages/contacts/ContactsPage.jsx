import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import Section from '../../components/UI/Section';
import Dashboard from '../../components/Dashboard/Dashboard';

import db from '../../utils/firebaseConfig';

const ContactsPage = () => {
  const [contactsList, setContactsList] = useState([]);

  useEffect(
    () => async () => {
      const contactsList = [];
      const querySnapshot = await getDocs(collection(db, 'players'));
      querySnapshot.forEach((doc) => {
        const item = {};
        item.id = doc.id;
        item.name = doc.data().name;
        item.description = doc.data().description;
        item.image = doc.data().image;
        contactsList.push(item);
        setContactsList(contactsList);
      });
    },
    []
  );

  return (
    <Section>
      {contactsList && contactsList.length > 0 && (
        <Dashboard list={contactsList} url='/contacts' />
      )}
    </Section>
  );
};

export default ContactsPage;
