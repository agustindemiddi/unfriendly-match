import Section from '../../UI/Section/Section';
import SoccerFieldContainer from '../../SoccerField/SoccerFieldContainer';

import styles from './HomeSection.module.css';

import separateMatches from '../../../utils/separateMatches';

const HomeSection = ({ matches }) => {
  const {
    sortedUpcomingMatches,
    reverseSortedPreviousMatches,
    nextMatch,
    lastMatch,
  } = separateMatches(matches);

  return (
    <Section noActionsBar>
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
      {reverseSortedPreviousMatches && reverseSortedPreviousMatches[0] && (
        <SoccerFieldContainer match={reverseSortedPreviousMatches[0]} />
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

export default HomeSection;
