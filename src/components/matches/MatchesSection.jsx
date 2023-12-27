import { Link } from 'react-router-dom';

import Section from '../UI/Section';
import MatchesList from './MatchesList/MatchesList';

import separateMatches from '../../utils/separateMatches';
import formatDate from '../../utils/formatDate';

const MatchesSection = ({ matches }) => {
  const {
    sortedUpcomingMatches,
    reverseSortedPreviousMatches,
    nextMatch,
    lastMatch,
  } = separateMatches(matches);

  return (
    <Section>
      <Link to='new'>
        <button>CREAR PARTIDO</button>
      </Link>
      <h2>UPCOMING MATCHES</h2>
      {sortedUpcomingMatches && sortedUpcomingMatches.length > 0 && (
        <MatchesList matches={sortedUpcomingMatches} />
      )}
      <h2>PREVIOUS MATCHES</h2>
      {reverseSortedPreviousMatches &&
        reverseSortedPreviousMatches.length > 0 && (
          <MatchesList matches={reverseSortedPreviousMatches} />
        )}
    </Section>
  );
};

export default MatchesSection;
