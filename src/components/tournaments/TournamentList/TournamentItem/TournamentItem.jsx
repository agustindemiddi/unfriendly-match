import { Link } from 'react-router-dom';

import styles from './TournamentItem.module.css';

const TournamentItem = ({ tournament }) => {
  return (
    <div>
      <Link to={`/tournaments/${tournament.id}`}>
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src={tournament.image}
            alt='Tournament cup image'
          />
        </div>
      </Link>
      <p>{tournament.name}</p>
    </div>
  );
};

export default TournamentItem;
