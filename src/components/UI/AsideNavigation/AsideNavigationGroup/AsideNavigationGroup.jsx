import { NavLink, useParams } from 'react-router-dom';

import AsideNavigationTournamentItem from './AsideNavigationTournamentItem/AsideNavigationTournamentItem';

import styles from './AsideNavigationGroup.module.css';

const AsideNavigationGroup = ({ navGroup }) => {
  const { tournamentId } = useParams();
  // console.log(navGroup.collection);

  const selectedTournament = navGroup.collection?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];

  return (
    <div className={styles.navGroup}>
      <NavLink
        className={({ isActive }) => (isActive ? styles.activeLink : '')}
        to={navGroup.url}>
        {navGroup.name}
      </NavLink>
      {navGroup.collection?.length > 0 && (
        <ul>
          {navGroup.collection.map((tournamentNavItem) => (
            <li key={tournamentNavItem.id}>
              <AsideNavigationTournamentItem navItem={tournamentNavItem} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AsideNavigationGroup;
