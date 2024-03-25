import { useState, useEffect } from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';

import AsideNavigationMatchItem from './AsideNavigationMatchItem/AsideNavigationMatchItem';

import styles from './AsideNavigationTournamentItem.module.css';

import { getUserAuthCtx } from '../../../../../context/authContext';
import separateMatches from '../../../../../utils/separateMatches';

const AsideNavigationTournamentItem = ({ navItem }) => {
  const [isMatchesLocation, setIsMatchesLocation] = useState(false);
  const { tournamentId } = useParams();
  const { updatedTournamentMatches } = getUserAuthCtx();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith(`/tournaments/${tournamentId}/matches`)) {
      setIsMatchesLocation(true);
    } else {
      setIsMatchesLocation(false);
    }
  }, [location.pathname]);

  const tournamentMatches = updatedTournamentMatches?.filter(match => match.tournament === tournamentId)

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
        <div
          className={`${styles.matchesList} ${
            isMatchesLocation ? styles.matchesLocation : ''
          }`}>
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
