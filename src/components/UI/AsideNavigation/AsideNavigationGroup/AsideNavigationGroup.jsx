import { NavLink } from 'react-router-dom';

import AsideNavigationTournamentItem from './AsideNavigationTournamentItem/AsideNavigationTournamentItem';

import styles from './AsideNavigationGroup.module.css';

const AsideNavigationGroup = ({ navItem }) => {
  return (
    <>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.navItem} ${styles.activeLink}` : styles.navItem
        }
        to={navItem.url}>
        {navItem.name}
      </NavLink>
      {navItem.collection?.length > 0 && (
        <ul>
          {navItem.collection.map((tournament) => (
            <li key={tournament.id}>
              <AsideNavigationTournamentItem navItem={tournament} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default AsideNavigationGroup;
