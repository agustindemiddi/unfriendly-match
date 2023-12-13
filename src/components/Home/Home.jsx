import Section from '../UI/Section';
import SoccerField from '../matches/SoccerField';

import separateMatches from '../../utils/separateMatches';

// temporary:
import formatDate from '../../utils/formatDate';

const Home = ({ userMatches }) => {
  const {
    sortedUpcomingMatches,
    reverseSortedPreviousMatches,
    nextMatch,
    lastMatch,
  } = separateMatches(userMatches);

  return (
    <Section>
      {/* <h2>Next Match:</h2>
      {nextMatch && <SoccerField match={nextMatch} />}
      <h2>Last Match:</h2>
      {lastMatch && <SoccerField match={lastMatch} />} */}

      {/* temporary >>> */}
      {/* <h2>Test Match:</h2>
      {sortedUpcomingMatches && sortedUpcomingMatches[1] && (
        <SoccerField match={sortedUpcomingMatches[1]} />
      )} */}
      {/* temporary <<< */}

      {/* temporary >>> */}
      <h2>Upcoming Matches:</h2>
      {sortedUpcomingMatches && sortedUpcomingMatches.length > 0 && (
        <ul>
          {sortedUpcomingMatches.map((match) => (
            <SoccerField key={match.id} match={match} />
          ))}
        </ul>
      )}
      <h2>Previous Matches:</h2>
      {reverseSortedPreviousMatches &&
        reverseSortedPreviousMatches.length > 0 && (
          <ul>
            {reverseSortedPreviousMatches.map((match) => (
              <SoccerField key={match.id} match={match} />
            ))}
          </ul>
        )}
      {/* temporary <<< */}

      {/* temporary >>> */}
      <h2>next match</h2>
      <div style={{ border: '1px solid white', margin: '15px' }}>
        <p>{nextMatch && formatDate(nextMatch.dateTime)}</p>
      </div>
      <h2>upcoming matches</h2>
      <ul>
        {sortedUpcomingMatches.map((match) => (
          <li
            key={match.id}
            style={{ border: '1px solid white', margin: '15px' }}>
            <p>{formatDate(match.dateTime)}</p>
          </li>
        ))}
      </ul>
      <h2>last match</h2>
      <div style={{ border: '1px solid white', margin: '15px' }}>
        <p>{lastMatch && formatDate(lastMatch.dateTime)}</p>
      </div>
      <h2>previous matches</h2>
      <ul>
        {reverseSortedPreviousMatches.map((match) => (
          <li
            key={match.id}
            style={{ border: '1px solid white', margin: '15px' }}>
            <p>{formatDate(match.dateTime)}</p>
          </li>
        ))}
      </ul>
      {/* temporary <<< */}
    </Section>
  );
};

export default Home;
