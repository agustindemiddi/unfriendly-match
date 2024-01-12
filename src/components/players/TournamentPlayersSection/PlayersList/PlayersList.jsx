import PlayerItem from './PlayerItem/PlayerItem';

import styles from './PlayersList.module.css';

const PlayersList = ({ players }) => {
  return (
    <ul>
      {players.map((player) => (
        <li key={player.id}>
          <PlayerItem player={player} />
        </li>
      ))}
    </ul>
  );
};

export default PlayersList;
