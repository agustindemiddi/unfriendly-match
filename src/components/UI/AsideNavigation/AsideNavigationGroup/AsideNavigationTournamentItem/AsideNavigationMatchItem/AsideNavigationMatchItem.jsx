// import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import styles from './AsideNavigationMatchItem.module.css';

import { asideNavFormatDate } from '../../../../../../utils/formatDate';

const AsideNavigationMatchItem = ({
  navItem,
  index,
  previousMatches,
  nextMatch,
}) => {
  const { tournamentId } = useParams();

  const isPreviousMatch = previousMatches.some(
    (match) => match.id === navItem.id
  );

  const isNextMatch = nextMatch.id === navItem.id;

  return (
    <>
      <NavLink
        className={({ isActive }) =>
          isActive
            ? `${styles.navItem} ${styles.activeLink} ${
                isNextMatch ? styles.nextMatch : ''
              }`
            : `${styles.navItem} ${
                isPreviousMatch ? styles.previousMatch : ''
              } ${isNextMatch ? styles.nextMatch : ''}`
        }
        to={`/tournaments/${tournamentId}/matches/${navItem.id}`}>
        Match {index} · {asideNavFormatDate(navItem.dateTime)}
      </NavLink>
    </>
  );
};

export default AsideNavigationMatchItem;
