import styles from './PlayerItem.module.css';

const PlayerItem = ({ player }) => {
  return (
    <div style={{ border: '1px solid' }}>
      <p>{player.displayName}</p>
      <p>{player.username}</p>
      <img src={player.image} style={{ width: '200px' }} />
    </div>
  );
};

export default PlayerItem;