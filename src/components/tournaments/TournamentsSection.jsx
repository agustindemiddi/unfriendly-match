import { Link } from 'react-router-dom';

import Section from '../UI/Section';
import TournamentsList from './TournamentsList/TournamentsList';

import separateTournaments from '../../utils/separateTournaments';

const TournamentsSection = ({ tournaments }) => {
  const { active, finished } = separateTournaments(tournaments);
  const tournamentTypeLists = [active, finished];

  return (
    <Section>
      <Link to='new'>CREATE TOURNAMENT</Link>
      {tournamentTypeLists.map((tournamentsList, index) => (
        <div key={index}>
          {tournamentsList.length > 0 && (
            <>
              <h2>{index === 0 ? 'Active' : 'Finished'} Tournaments:</h2>
              <TournamentsList tournaments={tournamentsList} />
            </>
          )}
        </div>
      ))}
    </Section>
  );
};

export default TournamentsSection;
