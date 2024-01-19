import TournamentPlayerItem from './TournamentPlayerItem/TournamentPlayerItem';

import styles from './TournamentPlayersList.module.css';

const TournamentPlayersList = ({ players }) => {
  return (
    <ul>
      {players.map((player) => (
        <li key={player.id}>
          <TournamentPlayerItem player={player} />
        </li>
      ))}
    </ul>
  );
};

export default TournamentPlayersList;
