import Section from '../../UI/Section';
import PlayersList from '../../Players/PlayersList/PlayersList';

const TournamentPlayersSection = ({ tournament, players }) => {
  return (
    <Section>
      <h2>{tournament.name} players:</h2>
      {players.length > 0 && <PlayersList players={players} />}
    </Section>
  );
};

export default TournamentPlayersSection;
