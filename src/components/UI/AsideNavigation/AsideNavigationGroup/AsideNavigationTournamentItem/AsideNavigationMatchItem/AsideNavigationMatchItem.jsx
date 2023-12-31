// import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import styles from './AsideNavigationMatchItem.module.css';

import { asideNavFormatDate } from '../../../../../../utils/formatDate';

const AsideNavigationMatchItem = ({ navItem, index }) => {
  const { tournamentId } = useParams();

  return (
    <>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.navItem} ${styles.activeLink}` : styles.navItem
        }
        to={`/tournaments/${tournamentId}/matches/${navItem.id}`}>
        Match {index} · {asideNavFormatDate(navItem.dateTime)}
      </NavLink>
    </>
  );
};

export default AsideNavigationMatchItem;
