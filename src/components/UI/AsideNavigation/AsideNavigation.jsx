import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import AsideNavigationGroup from './AsideNavigationGroup/AsideNavigationGroup';

import styles from './AsideNavigation.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import { getTournaments } from '../../../utils/firebase/firestore/firestoreActions';

const AsideNavigation = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const location = useLocation();
  const initialNavTree = [
    { name: 'MAIN', url: '/' },
    { name: 'TOURNAMENTS', url: '/tournaments', collection: [] },
    { name: 'CONTACTS', url: '/contacts' },
  ];
  const [navTree, setNavTree] = useState(initialNavTree);

  useEffect(() => {
    // get all user tournaments:
    if (userPlayerProfile && location.pathname.startsWith('/tournaments')) {
      const fetchAllUserTournaments = async () => {
        const fetchedTournaments = await getTournaments(
          userPlayerProfile.tournaments.all
        );
        setNavTree((prevState) => {
          const newNavTree = [...prevState];
          newNavTree[1].collection = fetchedTournaments;
          return newNavTree;
        });
      };
      fetchAllUserTournaments();
    }
    if (userPlayerProfile && location.pathname !== '/tournaments') {
      setNavTree(initialNavTree);
    }
  }, [userPlayerProfile, location.pathname]);

  // useEffect(() => {
  //   if (tournamentId) {
  //     // get tournament matches:
  //   }
  // }, [tournamentId]);

  return (
    <nav className={styles.asideNav}>
      <ul>
        {navTree.map((navGroup) => (
          <li key={navGroup.name}>
            <AsideNavigationGroup navGroup={navGroup} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AsideNavigation;
