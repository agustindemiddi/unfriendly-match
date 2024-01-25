import { NavLink, useParams } from 'react-router-dom';

import styles from './AsideNavigationMatchItem.module.css';

import { getStringFormattedShortDate } from '../../../../../../utils/getDates';

const AsideNavigationMatchItem = ({ navItem, index, previousMatches }) => {
  const { tournamentId } = useParams();

  const isPreviousMatch = previousMatches.some(
    (match) => match.id === navItem.id
  );

  return (
    <>
      <NavLink
        className={({ isActive }) =>
          isActive
            ? `${styles.navItem} ${styles.activeLink}`
            : `${styles.navItem} ${isPreviousMatch ? styles.previousMatch : ''}`
        }
        to={`/tournaments/${tournamentId}/matches/${navItem.id}`}>
        Match {index} · {getStringFormattedShortDate(navItem.dateTime)}
      </NavLink>
    </>
  );
};

export default AsideNavigationMatchItem;
