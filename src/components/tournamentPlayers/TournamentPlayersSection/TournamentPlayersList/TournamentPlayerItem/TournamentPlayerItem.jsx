import styles from './TournamentPlayerItem.module.css';

import { getUserAuthCtx } from '../../../../../context/authContext';
import { mergePlayers } from '../../../../../utils/firebase/firestore/firestoreActions';

const TournamentPlayerItem = ({ player }) => {
  const { userPlayerProfile } = getUserAuthCtx();

  const handleMerge = async () => {
    await mergePlayers(userPlayerProfile, player);
  };

  return (
    <div style={{ border: '1px solid' }}>
      <p>{player.displayName}</p>
      <button onClick={() => console.log(player)}>LOG PLAYER INFO</button>
      {!player.isVerified && <button onClick={handleMerge}>MERGE</button>}
      <img src={player.image} style={{ width: '200px' }} />
    </div>
  );
};

export default TournamentPlayerItem;
