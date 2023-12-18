import { Link } from 'react-router-dom';

import StandingsTable from './StandingsTable/StandingsTable';

import styles from './TournamentDetail.module.css';

const TournamentDetail = ({ tournament, matches }) => {
  // console.log(tournament)
  // console.log(matches)
  return (
    <section className={styles.tournamentDetailsSection}>
      <Link to='matches/new'>
        <button>CREATE MATCH</button>
      </Link>
      <Link to='matches'>
        <button>go to All Matches</button>
      </Link>
      <div className={styles.matches}>
        <div className={styles.nextMatch}>nextMatch</div>
        <div className={styles.lastMatch}>lastMatch</div>
      </div>
      <div className={styles.standings}>
        <StandingsTable />
      </div>
    </section>
    // <div className={styles.test}>TournamentDetail</div>
  );
};

export default TournamentDetail;
