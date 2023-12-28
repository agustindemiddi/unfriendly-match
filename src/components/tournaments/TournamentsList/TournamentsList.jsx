import TournamentItem from './TournamentItem/TournamentItem';

import styles from './TournamentsList.module.css';

const TournamentsList = ({ tournaments }) => {
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

export default TournamentsList;
