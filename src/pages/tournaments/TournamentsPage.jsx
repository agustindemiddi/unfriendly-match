import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

import Section from '../../components/UI/Section';
import Dashboard from '../../components/Dashboard/Dashboard';

import styles from './TournamentsPage.module.css';

import db from '../../utils/firebase/firebaseConfig';

// import DUMMY_IMAGE2 from '../../assets/icons/cup/cup-svgrepo-com.svg';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const activeTournaments = [];
  const finishedTournaments = [];

  const finishedTournamentsContent = () => {
    return (
      <article className={styles.finishedTournaments}>
        <h2>Finished Tournaments:</h2>
        <div>display active tournaments here...</div>
      </article>
    );
  };

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
      });
      setTournaments(tournamentsList);
    },
    []
  );

  return (
    <Section className={styles.tournamentSection}>
      <Link to='new'>
        <button>CREATE TOURNAMENT</button>
      </Link>
      {tournaments && tournaments.length > 0 && (
        <Dashboard list={tournaments} url='/tournaments' />
      )}
      {/* <button className={styles.button}>Create new tournament</button> */}

      {/* <article className={styles.activeTournaments}>
        <h2>Active Tournaments:</h2>
        <ul className={styles.tournamentsList}>
          <li className={styles.imageContainer}>
            <img className={styles.image} src={DUMMY_IMAGE2} alt='' />
          </li>
          <li className={styles.imageContainer}>
            <img className={styles.image} src={DUMMY_IMAGE2} alt='' />
          </li>
        </ul>
      </article> */}

      {finishedTournaments.length ? finishedTournamentsContent : null}
    </Section>
  );
};

export default TournamentsPage;
