import { Link } from 'react-router-dom';

import Section from '../../UI/Section';
import SoccerFieldContainer from '../../matches/SoccerField/SoccerFieldContainer';
import StandingsTable from './StandingsTable/StandingsTable';

import styles from './TournamentDetail.module.css';

import separateMatches from '../../../utils/separateMatches';

const TournamentDetail = ({ tournament, matches }) => {
  const { nextMatch, lastMatch } = separateMatches(matches);

  return (
    <Section className={styles.tournamentDetailSection}>
      <div className={styles.matches}>
        <Link className={styles.button} to='matches/new'>
          Create Match
        </Link>
        {/* <button className={styles.button}>Show All Matches</button> */}
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
        <button className={styles.button}>Share Tournament</button>
        <button className={styles.button}>Join Tournament</button>
        <StandingsTable />
      </div>
    </Section>
  );
};

export default TournamentDetail;
