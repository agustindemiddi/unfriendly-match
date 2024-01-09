import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AsideNavigationGroup from './AsideNavigationGroup/AsideNavigationGroup';

import styles from './AsideNavigation.module.css';

import { getUserAuthCtx } from '../../../context/authContext';

const AsideNavigation = () => {
  const { userPlayerProfile, updatedUserTournaments } = getUserAuthCtx();
  const location = useLocation();
  const initialNavTree = [
    { name: 'MAIN', url: '/' },
    { name: 'CONTACTS', url: '/contacts' },
    { name: 'TOURNAMENTS', url: '/tournaments', collection: [] },
  ];
  const [navTree, setNavTree] = useState(initialNavTree);

  useEffect(() => {
    if (
      updatedUserTournaments &&
      location.pathname.startsWith('/tournaments')
    ) {
      setNavTree((prevState) => {
        const newNavTree = [...prevState];
        newNavTree[2].collection = updatedUserTournaments.active;
        return newNavTree;
      });
    } else if (
      userPlayerProfile &&
      !location.pathname.startsWith('/tournaments')
    ) {
      setNavTree(initialNavTree);
    }
  }, [updatedUserTournaments?.active, location.pathname]);

  return (
    <aside className={styles.asideNavigationPanel}>
      <nav>
        <ul>
          {navTree.map((navItem) => (
            <li key={navItem.name}>
              <AsideNavigationGroup navItem={navItem} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AsideNavigation;
