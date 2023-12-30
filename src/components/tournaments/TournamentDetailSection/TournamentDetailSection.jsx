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
  const [isUserTournamentPlayer, setIsUserTournamentPlayer] = useState(false);

  useEffect(() => {
    if (userPlayerProfile) {
      if (tournament?.players?.includes(userPlayerProfile?.id)) {
        setIsUserTournamentPlayer(true);
      } else {
        setIsUserTournamentPlayer(false);
      }
    }
  }, [userPlayerProfile, tournament.players]);

  const isUserAdmin = tournament?.admins?.includes(userPlayerProfile?.id);

  const handleSubscribeToTournament = () => {
    subscribeToTournament(tournament.id, userPlayerProfile.id);
    setIsUserTournamentPlayer(true);
  };

  const handleUnsubscribeFromTournament = () => {
    unsubscribeFromTournament(tournament.id, userPlayerProfile.id);
    setIsUserTournamentPlayer(false);
  };

  const { nextMatch, lastMatch } = separateMatches(matches);

  return (
    <Section className={styles.tournamentDetailSection}>
      <div className={styles.matches}>
        {userPlayerProfile && isUserAdmin && (
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
        {userPlayerProfile && isUserTournamentPlayer && (
          <button
            className={styles.button}
            onClick={handleUnsubscribeFromTournament}
            style={{ backgroundColor: 'red' }}>
            Leave Tournament
          </button>
        )}
        {userPlayerProfile && isUserTournamentPlayer && (
          <button className={styles.button} onClick={copyUrlToClipboard}>
            Share Tournament
          </button>
        )}
        {userPlayerProfile && !isUserTournamentPlayer && (
          <button
            className={styles.button}
            onClick={handleSubscribeToTournament}>
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
