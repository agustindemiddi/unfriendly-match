import TournamentItem from './TournamentItem/TournamentItem';

import styles from './TournamentList.module.css';

const TournamentList = ({ tournaments }) => {
  return (
    <ul className={styles.tournamentsList}>
      {tournaments.map((tournament) => (
        <li key={tournament.id}>
          <TournamentItem tournament={tournament} />
        </li>
      ))}
    </ul>
  );
};

export default TournamentList;
