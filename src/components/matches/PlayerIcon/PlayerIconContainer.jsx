import PlayerIcon from './PlayerIcon';

import { getUserAuthCtx } from '../../../context/AuthContext';
import {
  subscribeToMatch,
  unsubscribeFromMatch,
} from '../../../utils/firebase/firestore/firestoreActions';

const PlayerIconContainer = ({
  image,
  isRegistryOpen,
  isUserSubscribed,
  username,
  playerId,
  tournamentId,
  matchId,
}) => {
  const {
    userPlayerProfile: { id: userId },
  } = getUserAuthCtx();

  const handleSubscribeToMatch = (
    isRegistryOpen,
    isUserSubscribed,
    tournamentId,
    matchId,
    userId
  ) => {
    if (isRegistryOpen && !isUserSubscribed) {
      subscribeToMatch(tournamentId, matchId, userId);
    }
  };

  const handleUnsubscribeFromMatch = (
    isRegistryOpen,
    isUserSubscribed,
    tournamentId,
    matchId,
    userId,
    playerId
  ) => {
    if (playerId === userId && isRegistryOpen && isUserSubscribed) {
      unsubscribeFromMatch(tournamentId, matchId, userId);
    }
  };

  return (
    <PlayerIcon
      image={image}
      isRegistryOpen={isRegistryOpen}
      isUserSubscribed={isUserSubscribed}
      username={username}
      playerId={playerId}
      tournamentId={tournamentId}
      matchId={matchId}
      userId={userId}
      handleSubscribeToMatch={handleSubscribeToMatch}
      handleUnsubscribeFromMatch={handleUnsubscribeFromMatch}
    />
  );
};

export default PlayerIconContainer;
