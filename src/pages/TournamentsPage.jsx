import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import PageContent from '../components/UI/PageContent';
import Dashboard from '../components/Dashboard/Dashboard';

import db from '../utils/firebaseConfig';

const TournamentsPage = () => {
  const [tournamentsList, setTournamentsList] = useState([]);

  useEffect(
    () => async () => {
      const tournamentsList = [];
      const querySnapshot = await getDocs(collection(db, 'tournaments'));
      querySnapshot.forEach((doc) => {
        const item = {};
        item.id = doc.id;
        item.name = doc.data().name;
        item.description = doc.data().description;
        item.image = doc.data().image;
        item.players = doc.data().players;
        tournamentsList.push(item);
        setTournamentsList(tournamentsList);
      });
    },
    []
  );

  return (
    <PageContent title='My Tournaments'>
      {tournamentsList && tournamentsList.length > 0 && (
        <Dashboard list={tournamentsList} urlBase='/tournaments' />
      )}
    </PageContent>
  );
};

export default TournamentsPage;
