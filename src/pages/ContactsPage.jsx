import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import PageContent from '../components/UI/PageContent';
import Dashboard from '../components/Dashboard/Dashboard';

import db from '../utils/firebaseConfig';

const ContactsPage = () => {
  const [contactsList, setContactsList] = useState([]);

  useEffect(
    () => async () => {
      const contactsList = [];
      const querySnapshot = await getDocs(collection(db, 'users'));
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
    <PageContent title='My Contacts'>
      {contactsList && contactsList.length > 0 && (
        <Dashboard list={contactsList} urlBase='/contacts' />
      )}
    </PageContent>
  );
};

export default ContactsPage;
