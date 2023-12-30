import { Link, useParams } from 'react-router-dom';

import styles from './AsideNavigationTournamentItem.module.css';

const AsideNavigationTournamentItem = ({ navItem }) => {
  const { tournamentId, matchId } = useParams();

  const isSelectedTournament = navItem.id === tournamentId;

  return (
    <div
      className={`${styles.navItem} ${
        isSelectedTournament ? styles.selectedTournament : ''
      }`}>
      <Link to={`/tournaments/${navItem.id}`}>{navItem.name}</Link>
      {/* navItem.matches? */}
      {/* {navItem.collection?.length > 0 && (
        <ul>
          {navItem.collection.map((tournamentNavItem) => (
            <li key={tournamentNavItem.id}>
              <AsideNavigationTournamentItem navItem={tournamentNavItem} />
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default AsideNavigationTournamentItem;
