import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import SoccerFieldContainer from '../../SoccerField/SoccerFieldContainer';
import StandingsTable from './StandingsTable/StandingsTable';

import styles from './TournamentDetailSection.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import separateMatches from '../../../utils/separateMatches';
import copyUrlToClipboard from '../../../utils/copyUrlToClipboard';
import {
  subscribeToTournament,
  unsubscribeFromTournament,
} from '../../../utils/firebase/firestore/firestoreActions';

const TournamentDetailSection = ({ tournament, matches }) => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [isTournamentPlayer, setIsTournamentPlayer] = useState(false);

  useEffect(() => {
    if (
      userPlayerProfile &&
      tournament?.players?.includes(userPlayerProfile.id)
    ) {
      setIsTournamentPlayer(true);
    } else {
      setIsTournamentPlayer(false);
    }
  }, [userPlayerProfile, tournament.players]);

  const isAdmin = tournament?.admins?.includes(userPlayerProfile?.id);

  const handleSubscribeToTournament = () => {
    subscribeToTournament(tournament.id, userPlayerProfile.id);
    setIsTournamentPlayer(true);
  };

  const handleUnsubscribeFromTournament = () => {
    unsubscribeFromTournament(tournament.id, userPlayerProfile.id);
    setIsTournamentPlayer(false);
  };

  const { nextMatch, lastMatch } = separateMatches(matches);

  return (
    <Section className={styles.tournamentDetailSection}>
      <div className={styles.matches}>
        {userPlayerProfile && isAdmin && (
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
        {userPlayerProfile && !isTournamentPlayer && (
          <button
            className={styles.button}
            onClick={handleSubscribeToTournament}
            style={{ backgroundColor: 'green' }}>
            Join Tournament
          </button>
        )}
        {userPlayerProfile && isTournamentPlayer && (
          <button
            className={styles.button}
            onClick={handleUnsubscribeFromTournament}
            style={{ backgroundColor: 'red' }}>
            Leave Tournament
          </button>
        )}
        {userPlayerProfile && isAdmin && (
          <Link className={styles.button} to='edit'>
            Edit Tournament
          </Link>
        )}
        {userPlayerProfile && isTournamentPlayer && (
          <button className={styles.button} onClick={copyUrlToClipboard}>
            Share Tournament
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
