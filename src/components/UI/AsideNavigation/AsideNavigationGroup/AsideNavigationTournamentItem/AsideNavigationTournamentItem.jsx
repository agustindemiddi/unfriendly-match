import { NavLink, useParams } from 'react-router-dom';

import AsideNavigationMatchItem from './AsideNavigationMatchItem/AsideNavigationMatchItem';

import styles from './AsideNavigationTournamentItem.module.css';

import { getUserAuthCtx } from '../../../../../context/authContext';
import separateMatches from '../../../../../utils/separateMatches';

const AsideNavigationTournamentItem = ({ navItem }) => {
  const { tournamentId } = useParams();
  const { tournamentMatches } = getUserAuthCtx();

  const { reverseSortedListedAllMatches, reverseSortedPreviousMatches } =
    separateMatches(tournamentMatches || []);

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
        <div className={styles.matchesList}>
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
                  previousMatches={reverseSortedPreviousMatches}
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
