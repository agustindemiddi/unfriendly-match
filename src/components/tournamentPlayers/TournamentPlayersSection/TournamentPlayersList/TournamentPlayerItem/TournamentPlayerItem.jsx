import { useParams, useNavigate } from 'react-router-dom';

import styles from './TournamentPlayerItem.module.css';

import { getUserAuthCtx } from '../../../../../context/authContext';
import {
  requestMerge,
  cancelMergeRequest,
  unsubscribeFromTournament,
  deleteNonVerifiedPlayer,
  makeTournamentAdmin,
  undoTournamentAdmin,
} from '../../../../../utils/firebase/firestore/firestoreActions';

const TournamentPlayerItem = ({ player, isUserCreator, isAdmin }) => {
  const { tournamentId } = useParams();
  const { userPlayerProfile } = getUserAuthCtx();
  const navigate = useNavigate();

  const isMergeRequestDone = player?.mergeRequests?.some(
    (mergeRequest) => mergeRequest.requestedBy === userPlayerProfile.id
  );

  const handleDeleteNonVerifiedPlayer = async () => {
    if (player.tournaments.all.length === 1) {
      await deleteNonVerifiedPlayer(tournamentId, player.id);
    } else {
      await unsubscribeFromTournament(tournamentId, player.id);
    }
  };

  return (
    <div style={{ border: '1px solid' }}>
      <p>{player.displayName}</p>
      {!player.isVerified && player.createdBy === userPlayerProfile.id && (
        <button
          onClick={() => navigate(`${player.id}/edit`, { state: player })}>
          EDIT PLAYER
        </button>
      )}
      {!player.isVerified && player.createdBy === userPlayerProfile.id && (
        <button onClick={handleDeleteNonVerifiedPlayer}>DELETE PLAYER</button>
      )}
      {isUserCreator &&
        player.isVerified &&
        player.id !== userPlayerProfile.id && (
          <button
            onClick={
              isAdmin
                ? () => undoTournamentAdmin(tournamentId, player.id)
                : () => makeTournamentAdmin(tournamentId, player.id)
            }>
            {isAdmin ? 'UNDO TOURNAMENT ADMIN' : 'MAKE TOURNAMENT ADMIN'}
          </button>
        )}
      {/* <button onClick={() => console.log(player)}>LOG PLAYER INFO</button> */}
      {!player.isVerified && player.createdBy !== userPlayerProfile.id && (
        <button
          onClick={
            isMergeRequestDone
              ? async () => await cancelMergeRequest(userPlayerProfile, player)
              : async () =>
                  await requestMerge(userPlayerProfile, player, tournamentId)
          }>
          {isMergeRequestDone ? 'CANCEL MERGE REQUEST' : 'REQUEST MERGE'}
        </button>
      )}
      <img src={player.image} style={{ width: '200px' }} />
    </div>
  );
};

export default TournamentPlayerItem;
