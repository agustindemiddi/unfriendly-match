import Section from '../../UI/Section/Section';
import PlayersList from '../../players/PlayersList/PlayersList';

import styles from './TournamentPlayersSection.module.css';

const TournamentPlayersSection = ({ tournament, players }) => {
  return (
    <Section>
      <h2>{tournament.name} players:</h2>
      {players.length > 0 && <PlayersList players={players} />}
    </Section>
  );
};

export default TournamentPlayersSection;
