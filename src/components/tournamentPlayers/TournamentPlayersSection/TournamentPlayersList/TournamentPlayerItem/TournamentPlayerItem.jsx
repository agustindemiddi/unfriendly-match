import styles from './TournamentPlayerItem.module.css';

import { getUserAuthCtx } from '../../../../../context/authContext';
import {
  requestMerge,
  cancelMergeRequest,
  // mergePlayers,
} from '../../../../../utils/firebase/firestore/firestoreActions';

const TournamentPlayerItem = ({ player }) => {
  const { userPlayerProfile } = getUserAuthCtx();

  const isRequestDone = player?.mergeRequests?.some(
    (mergeRequest) => mergeRequest.requestedBy === userPlayerProfile.id
  );

  return (
    <div style={{ border: '1px solid' }}>
      <p>{player.displayName}</p>
      <button onClick={() => console.log(player)}>LOG PLAYER INFO</button>
      {!player.isVerified && (
        <button
          onClick={
            isRequestDone
              ? () => cancelMergeRequest(userPlayerProfile, player)
              : () => requestMerge(userPlayerProfile, player)
          }>
          {isRequestDone ? 'CANCEL MERGE REQUEST' : 'REQUEST MERGE'}
        </button>
      )}
      <img src={player.image} style={{ width: '200px' }} />
    </div>
  );
};

export default TournamentPlayerItem;
