import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import PageContent from '../components/UI/PageContent';
import Dashboard from '../components/Dashboard/Dashboard';

import styles from './TournamentsPage.module.css';

import db from '../utils/firebaseConfig';

import DUMMY_IMAGE2 from '../assets/icons/cup/cup-svgrepo-com.svg';

const TournamentsPage = () => {
  const [tournamentsList, setTournamentsList] = useState([]);
  const activeTournaments = [];
  const finishedTournaments = [];

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
      {/* {tournamentsList && tournamentsList.length > 0 && (
        <Dashboard list={tournamentsList} url='/tournaments' />
      )} */}
      <div className={styles.TournamentsPageLayout}>
        <div className={styles.header}>
          <button>Create new tournament</button>
        </div>
        <div className={styles.content}>
          <h2>Active Tournaments:</h2>
          <div>
            <div className={styles.imageContainer}>
              <img className={styles.image} src={DUMMY_IMAGE2} alt='' />
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <h2>Finished Tournaments:</h2>
          <div>display active tournaments here...</div>
        </div>
      </div>
    </PageContent>
  );
};

export default TournamentsPage;
