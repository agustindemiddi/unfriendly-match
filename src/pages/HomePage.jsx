import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import Section from '../components/UI/Section';
import Dashboard from '../components/Dashboard/Dashboard';

import MatchField from '../components/matches/MatchField/MatchField';

import db from '../utils/firebaseConfig';

const HomePage = () => {
  const [tournamentsList, setTournamentsList] = useState([]);
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
    <Section>
      <MatchField />
      {/* <Dashboard list={tournamentsList} url='/tournaments' />
      <Dashboard list={contactsList} url='/contacts' /> */}
    </Section>
  );
};

export default HomePage;
