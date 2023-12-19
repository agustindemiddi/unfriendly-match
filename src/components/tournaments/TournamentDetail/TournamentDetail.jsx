import { Link } from 'react-router-dom';

import Section from '../../UI/Section';
import SoccerFieldContainer from '../../matches/SoccerField/SoccerFieldContainer';
import StandingsTable from './StandingsTable/StandingsTable';

import styles from './TournamentDetail.module.css';

import separateMatches from '../../../utils/separateMatches';

const TournamentDetail = ({ tournament, matches }) => {
  const {
    nextMatch,
    lastMatch,
    sortedUpcomingMatches,
    reverseSortedPreviousMatches,
  } = separateMatches(matches);

  return (
    <Section className={styles.tournamentDetailSection}>
      <div>
        <Link to='matches'>
          <button>See All Matches</button>
        </Link>
        <Link to='matches/new'>
          <button>Create Match</button>
        </Link>
      </div>
      <div className={styles.main}>
        <div className={styles.matches}>
          {nextMatch && <SoccerFieldContainer match={nextMatch} />}
          {lastMatch && <SoccerFieldContainer match={lastMatch} />}
        </div>
        <div className={styles.standings}>
          <StandingsTable />
        </div>
      </div>
    </Section>
  );
};

export default TournamentDetail;
