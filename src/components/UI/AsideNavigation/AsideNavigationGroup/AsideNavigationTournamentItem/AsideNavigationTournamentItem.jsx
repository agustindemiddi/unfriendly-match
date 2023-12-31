import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import AsideNavigationMatchItem from './AsideNavigationMatchItem/AsideNavigationMatchItem';

import styles from './AsideNavigationTournamentItem.module.css';

import { getTournamentMatches } from '../../../../../utils/firebase/firestore/firestoreActions';
import separateMatches from '../../../../../utils/separateMatches';

const AsideNavigationTournamentItem = ({ navItem }) => {
  const { tournamentId } = useParams();
  const [tournamentMatches, setTournamentMatches] = useState([]);

  useEffect(() => {
    // get tournament matches:
    if (location.pathname.startsWith(`/tournaments/${tournamentId}`)) {
      const fetchTournamentMatches = async () => {
        const matches = await getTournamentMatches(tournamentId);
        setTournamentMatches(matches);
      };
      fetchTournamentMatches();
    }
  }, [location.pathname, tournamentId]);

  const { reverseSortedListedAllMatches } = separateMatches(tournamentMatches);

  const isSelectedTournament = navItem.id === tournamentId;

  return (
    <>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.navItem} ${styles.activeLink}` : styles.navItem
        }
        to={`/tournaments/${navItem.id}`}>
        {navItem.name}
      </NavLink>
      {isSelectedTournament && reverseSortedListedAllMatches?.length > 0 && (
        <div>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.activeLink}`
                : styles.navItem
            }
            to={`/tournaments/${navItem.id}/matches`}
            end>
            MATCHES
          </NavLink>
          <ul>
            {reverseSortedListedAllMatches.map((match) => (
              <li key={match.data.id}>
                <AsideNavigationMatchItem
                  navItem={match.data}
                  index={match.number}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AsideNavigationTournamentItem;
