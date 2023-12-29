import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import SoccerFieldContainer from '../../matches/SoccerField/SoccerFieldContainer';
import StandingsTable from './StandingsTable/StandingsTable';

import styles from './TournamentDetailSection.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import separateMatches from '../../../utils/separateMatches';
import copyUrlToClipboard from '../../../utils/copyUrlToClipboard';
import { subscribeToTournament } from '../../../utils/firebase/firestore/firestoreActions';

const TournamentDetailSection = ({ tournament, matches }) => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [user, setUser] = useState(null);

  const showCreateMatchButton = tournament?.admins?.includes(user?.id);
  const hideJoinTournamentButton = tournament?.players?.includes(user?.id);

  // in SoccerFieldContainer.jsx I obtain the userPlayerProfile data immediately. Why?
  useEffect(() => {
    if (userPlayerProfile) setUser(userPlayerProfile);
  }, [userPlayerProfile]);

  const { nextMatch, lastMatch } = separateMatches(matches);

  return (
    <Section className={styles.tournamentDetailSection}>
      <div className={styles.matches}>
        {showCreateMatchButton && (
          <Link className={styles.button} to='matches/new'>
            Create Match
          </Link>
        )}
        <Link className={styles.button} to='matches'>
          See All Matches
        </Link>
        {nextMatch && (
          <>
            <h2>Next Match:</h2>
            <SoccerFieldContainer match={nextMatch} />
          </>
        )}
        {lastMatch && (
          <>
            <h2>Last Match:</h2>
            <SoccerFieldContainer match={lastMatch} />
          </>
        )}
      </div>
      <div className={styles.standings}>
        <button className={styles.button} onClick={copyUrlToClipboard}>
          Share Tournament
        </button>
        {user && !hideJoinTournamentButton && (
          <button
            className={styles.button}
            onClick={() => subscribeToTournament(tournament.id, user.id)}>
            Join Tournament
          </button>
        )}
        <Link className={styles.button} to='players'>
          See All Players
        </Link>
        <StandingsTable />
      </div>
    </Section>
  );
};

export default TournamentDetailSection;
