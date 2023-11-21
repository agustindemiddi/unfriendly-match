import StandingsTable from './StandingsTable';

import styles from './TournamentDetailsItem.module.css';

const TournamentDetailsItem = ({ item }) => {
  return (
    <section className={styles.tournamentDetailsSection}>
      <div className={styles.matches}>
        <div className={styles.nextMatch}>nextMatch</div>
        <div className={styles.lastMatch}>lastMatch</div>
      </div>
      <div className={styles.standings}>
      <StandingsTable />
      </div>
    </section>
    // <div className={styles.test}>TournamentDetailsItem</div>
  );
};

export default TournamentDetailsItem;
