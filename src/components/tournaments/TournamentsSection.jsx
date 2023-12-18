import { Link } from 'react-router-dom';

import Section from '../UI/Section';
import TournamentList from './TournamentList/TournamentList';

import separateTournaments from '../../utils/separateTournaments';

const TournamentsSection = ({ tournaments }) => {
  const { active, finished } = separateTournaments(tournaments);
  const tournamentsLists = [active, finished];

  return (
    <Section>
      <Link to='new'>CREATE TOURNAMENT</Link>
      {tournamentsLists.map((tournamentsList, index) => (
        <div key={index}>
          <h2>{index === 0 ? 'Active' : 'Finished'} Tournaments:</h2>
          {tournamentsList.length > 0 && (
            <TournamentList tournaments={tournamentsList} />
          )}
        </div>
      ))}
    </Section>
  );
};

export default TournamentsSection;
