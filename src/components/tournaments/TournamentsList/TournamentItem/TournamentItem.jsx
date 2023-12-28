import { Link } from 'react-router-dom';

import styles from './TournamentItem.module.css';

const TournamentItem = ({ tournament }) => {
  return (
    <Link to={`/tournaments/${tournament.id}`}>
      <div className={styles.tournamentItem}>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src={tournament.image}
            alt='Tournament cup image'
          />
        </div>
        <p>{tournament.name}</p>
      </div>
    </Link>
  );
};

export default TournamentItem;
