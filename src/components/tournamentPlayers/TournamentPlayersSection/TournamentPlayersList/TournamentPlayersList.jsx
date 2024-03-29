import TournamentPlayerItem from './TournamentPlayerItem/TournamentPlayerItem';

import styles from './TournamentPlayersList.module.css';

const TournamentPlayersList = ({ players, isUserCreator, admins }) => {
  return (
    <ul>
      {players.map((player) => (
        <li key={player.id}>
          <TournamentPlayerItem
            player={player}
            isUserCreator={isUserCreator}
            isAdmin={admins.includes(player.id)}
          />
        </li>
      ))}
    </ul>
  );
};

export default TournamentPlayersList;
