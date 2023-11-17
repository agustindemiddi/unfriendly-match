import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import PageContent from '../components/UI/PageContent';
import Dashboard from '../components/Dashboard/Dashboard';

import db from '../utils/firebaseConfig';

const HomePage = () => {
  const [tournamentsList, setTournamentsList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [contactsList, setContactsList] = useState([]);

  useEffect(
    () => async () => {
      const tournamentsList = [];
      const tournamentsSnapshot = await getDocs(collection(db, 'tournaments'));
      tournamentsSnapshot.forEach((doc) => {
        const item = {};
        item.id = doc.id;
        item.name = doc.data().name;
        item.description = doc.data().description;
        item.image = doc.data().image;
        item.players = doc.data().players;
        tournamentsList.push(item);
        setTournamentsList(tournamentsList);
      });

      const groupsList = [];
      const groupsSnapshot = await getDocs(collection(db, 'groups'));
      groupsSnapshot.forEach((doc) => {
        const item = {};
        item.id = doc.id;
        item.name = doc.data().name;
        item.image = doc.data().image;
        item.players = doc.data().players;
        groupsList.push(item);
        setGroupsList(groupsList);
      });

      const contactsList = [];
      const contactsSnapshot = await getDocs(collection(db, 'players'));
      contactsSnapshot.forEach((doc) => {
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
    <PageContent title='Dashboard'>
      <Dashboard list={tournamentsList} url='/tournaments' />
      <Dashboard list={groupsList} url='/groups' />
      <Dashboard list={contactsList} url='/contacts' />
    </PageContent>
  );
};

export default HomePage;
