import Section from '../UI/Section';
import SoccerFieldContainer from '../matches/SoccerField/SoccerFieldContainer';

import separateMatches from '../../utils/separateMatches';

const Home = ({ userMatches }) => {
  const {
    sortedUpcomingMatches,
    reverseSortedPreviousMatches,
    nextMatch,
    lastMatch,
  } = separateMatches(userMatches);

  return (
    <Section>
      {/* <h2>Upcoming Matches:</h2>
      {sortedUpcomingMatches && sortedUpcomingMatches.length > 0 && (
        <ul>
          {sortedUpcomingMatches.map((match) => (
            <SoccerFieldContainer key={match.id} match={match} />
          ))}
        </ul>
      )}
      <h2>Last Match:</h2>
      {lastMatch && <SoccerFieldContainer match={lastMatch} />} */}

      {/* JUST FOR TESTING INDIVIDUAL MATCH PURPOSES >>> */}
      {/* <h2>Test Match:</h2>
      {sortedUpcomingMatches && sortedUpcomingMatches[1] && (
        <SoccerFieldContainer match={sortedUpcomingMatches[1]} />
      )} */}
      {/* JUST FOR TESTING INDIVIDUAL MATCH PURPOSES <<< */}

      {/* temporary >>> */}
      <h2>Upcoming Matches:</h2>
      {sortedUpcomingMatches && sortedUpcomingMatches.length > 0 && (
        <ul>
          {sortedUpcomingMatches.map((match) => (
            <SoccerFieldContainer key={match.id} match={match} />
          ))}
        </ul>
      )}
      <h2>Previous Matches:</h2>
      {reverseSortedPreviousMatches &&
        reverseSortedPreviousMatches.length > 0 && (
          <ul>
            {reverseSortedPreviousMatches.map((match) => (
              <SoccerFieldContainer key={match.id} match={match} />
            ))}
          </ul>
        )}
      {/* temporary <<< */}
    </Section>
  );
};

export default Home;
