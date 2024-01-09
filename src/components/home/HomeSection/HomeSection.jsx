// import Lottie from 'lottie-react';

import Section from '../../UI/Section/Section';
import SoccerFieldContainer from '../../SoccerField/SoccerFieldContainer';
import LoadingBouncingSoccerBall from '../../UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

import styles from './HomeSection.module.css';

import separateMatches from '../../../utils/separateMatches';

// import bouncingBall from '../../../assets/bouncing-ball.json';

const HomeSection = ({ matches, isLoading }) => {
  const {
    sortedUpcomingMatches,
    reverseSortedPreviousMatches,
    nextMatch,
    lastMatch,
  } = separateMatches(matches);

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <Section>
          {/* {sortedUpcomingMatches && <h2>Upcoming Matches:</h2> &&
            sortedUpcomingMatches.length > 0 && (
              <ul>
                {sortedUpcomingMatches.map((match) => (
                  <SoccerFieldContainer key={match.id} match={match} />
                ))}
              </ul>
            )}

          {lastMatch && <h2>Last Match:</h2> && (
            <SoccerFieldContainer match={lastMatch} />
          )} */}

          {/* JUST FOR TESTING INDIVIDUAL MATCH PURPOSES >>> */}
          {sortedUpcomingMatches && <h2>Test Match:</h2> &&
            sortedUpcomingMatches[0] && (
              <SoccerFieldContainer match={sortedUpcomingMatches[0]} />
            )}
          {/* JUST FOR TESTING INDIVIDUAL MATCH PURPOSES <<< */}

          {/* temporary >>> */}
          {/* {sortedUpcomingMatches && <h2>Upcoming Matches:</h2> &&
            sortedUpcomingMatches.length > 0 && (
              <ul>
                {sortedUpcomingMatches.map((match) => (
                  <SoccerFieldContainer key={match.id} match={match} />
                ))}
              </ul>
            )}
          {reverseSortedPreviousMatches && <h2>Previous Matches:</h2> &&
            reverseSortedPreviousMatches.length > 0 && (
              <ul>
                {reverseSortedPreviousMatches.map((match) => (
                  <SoccerFieldContainer key={match.id} match={match} />
                ))}
              </ul>
            )} */}
          {/* temporary <<< */}
        </Section>
      )}
    </>
  );
};

export default HomeSection;
