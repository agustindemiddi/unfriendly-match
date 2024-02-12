import Section from '../../UI/Section/Section';
import SoccerFieldContainer from '../../SoccerField/SoccerFieldContainer';

import styles from './HomeSection.module.css';

import separateMatches from '../../../utils/separateMatches';

const HomeSection = ({ userPlayerProfile, tournaments, matches }) => {
  const {
    sortedUpcomingMatches,
    reverseSortedPreviousMatches,
    nextMatch,
    lastMatch,
  } = separateMatches(matches);

  return (
    <>
      <Section>
        {sortedUpcomingMatches.length > 0 && (
          <>
            <h2>Upcoming Matches:</h2>
            <ul>
              {sortedUpcomingMatches.map((match) => (
                <SoccerFieldContainer
                  key={match.id}
                  userPlayerProfile={userPlayerProfile}
                  tournament={tournaments?.active?.find(
                    (tournament) => tournament.id === match.tournament
                  )}
                  match={match}
                />
              ))}
            </ul>
          </>
        )}
        {lastMatch && (
          <>
            <h2>Last Match:</h2>
            <SoccerFieldContainer
              userPlayerProfile={userPlayerProfile}
              tournament={tournaments?.active?.find(
                (tournament) => tournament.id === lastMatch.tournament
              )}
              match={lastMatch}
            />
          </>
        )}
      </Section>

      {/* TEMPORARY: JUST FOR TESTING INDIVIDUAL MATCH PURPOSES >>> */}
      {/* <Section>
        <h2>Test Match:</h2>
      <SoccerFieldContainer
        userPlayerProfile={userPlayerProfile}
        tournament={tournaments?.active?.find(
          (tournament) => tournament.id === sortedUpcomingMatches[0].tournament
        )}
        match={sortedUpcomingMatches[0]}
      />
      </Section> */}
      {/* <<< TEMPORARY: JUST FOR TESTING INDIVIDUAL MATCH PURPOSES */}

      {/* TEMPORARY: JUST FOR TESTING MATCHES LISTS PURPOSES >>> */}
      {/* <Section>
        <h2>Upcoming Matches:</h2>
      <ul>
        {sortedUpcomingMatches.map((match) => (
          <SoccerFieldContainer
            key={match.id}
            userPlayerProfile={userPlayerProfile}
            tournament={tournaments?.active?.find(
              (tournament) => tournament.id === match.tournament
            )}
            match={match}
          />
        ))}
      </ul>
      <h2>Previous Matches:</h2>
      <ul>
        {reverseSortedPreviousMatches.map((match) => (
          <SoccerFieldContainer
            key={match.id}
            userPlayerProfile={userPlayerProfile}
            tournament={tournaments?.active?.find(
              (tournament) => tournament.id === match.tournament
            )}
            match={match}
          />
        ))}
      </ul>
      </Section> */}
      {/* <<< TEMPORARY: JUST FOR TESTING MATCHES LISTS PURPOSES */}
    </>
  );
};

export default HomeSection;
