import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AsideNavigationGroup from './AsideNavigationGroup/AsideNavigationGroup';

import styles from './AsideNavigation.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import { getTournaments } from '../../../utils/firebase/firestore/firestoreActions';

const AsideNavigation = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const location = useLocation();
  const initialNavTree = [
    { name: 'MAIN', url: '/' },
    { name: 'CONTACTS', url: '/contacts' },
    { name: 'TOURNAMENTS', url: '/tournaments', collection: [] },
  ];
  const [navTree, setNavTree] = useState(initialNavTree);

  useEffect(() => {
    // get user active tournaments:
    if (userPlayerProfile && location.pathname.startsWith('/tournaments')) {
      const fetchAllUserTournaments = async () => {
        const fetchedTournaments = await getTournaments(
          userPlayerProfile.tournaments.active
        );
        setNavTree((prevState) => {
          const newNavTree = [...prevState];
          newNavTree[2].collection = fetchedTournaments;
          return newNavTree;
        });
      };
      fetchAllUserTournaments();
    } else if (
      userPlayerProfile &&
      !location.pathname.startsWith('/tournaments')
    ) {
      setNavTree(initialNavTree);
    }
  }, [userPlayerProfile, location.pathname]);

  return (
    <nav className={styles.asideNav}>
      <ul>
        {navTree.map((navItem) => (
          <li key={navItem.name}>
            <AsideNavigationGroup navItem={navItem} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AsideNavigation;
