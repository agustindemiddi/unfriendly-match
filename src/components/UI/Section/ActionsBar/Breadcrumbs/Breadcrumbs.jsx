import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import styles from './Breadcrumbs.module.css';

import {
  getTournament,
  getTournamentMatches,
} from '../../../../../utils/firebase/firestore/firestoreActions';
import separateMatches from '../../../../../utils/separateMatches';

const Breadcrumbs = () => {
  const [tournamentName, setTournamentName] = useState('');
  const [matchNumber, setMatchNumber] = useState('');
  const location = useLocation();
  const { tournamentId, matchId } = useParams();

  useEffect(() => {
    // get tournament name:
    if (tournamentId) {
      const fetchTournamentName = async () => {
        const tournament = await getTournament(tournamentId);
        setTournamentName(tournament.name);
      };
      fetchTournamentName();
    }
  }, [tournamentId]);

  useEffect(() => {
    // get tournament matches:
    if (
      matchId &&
      location.pathname.startsWith(`/tournaments/${tournamentId}/matches`)
    ) {
      const fetchTournamentMatches = async () => {
        const matches = await getTournamentMatches(tournamentId);
        const { sortedListedAllMatches } = separateMatches(matches);
        const match = sortedListedAllMatches.filter(
          (match) => match.data.id === matchId
        )[0];
        setMatchNumber(match.number);
      };
      fetchTournamentMatches();
    }
  }, [location.pathname, tournamentId]);

  const pathSegments = location.pathname
    .split('/')
    .filter((segment) => segment !== '');

  const updatedPathSegments = pathSegments.map((item) => {
    switch (item) {
      case 'tournaments':
        return 'Tournaments';
      case 'matches':
        return 'Matches';
      default:
        return item;
    }
  });

  return (
    <div className={styles.breadcrumbs}>
      {/* <span>
        <Link to='/'>Main</Link>
        {updatedPathSegments.length > 0 && ' / '}
      </span> */}
      {updatedPathSegments.map((segment, index) => (
        <span key={segment}>
          {index < updatedPathSegments.length - 1 ? (
            <Link to={`/${pathSegments.slice(0, index + 1).join('/')}`}>
              {tournamentId && segment === tournamentId
                ? tournamentName
                : matchId && segment === matchId
                ? `Match ${matchNumber}`
                : segment}
            </Link>
          ) : (
            <>
              {tournamentId && segment === tournamentId
                ? tournamentName
                : matchId && segment === matchId
                ? `Match ${matchNumber}`
                : segment}
            </>
          )}
          {index < updatedPathSegments.length - 1 && ' / '}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
