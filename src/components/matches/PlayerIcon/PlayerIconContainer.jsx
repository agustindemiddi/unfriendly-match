import PlayerIcon from './PlayerIcon';

import { getUserAuthCtx } from '../../../context/AuthContext';
import {
  subscribeToMatch,
  unsubscribeFromMatch,
} from '../../../utils/firebase/firestore/firestoreActions';

const PlayerIconContainer = ({
  image,
  isSubscriptionOpen,
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
    isSubscriptionOpen,
    isUserSubscribed,
    tournamentId,
    matchId,
    userId
  ) => {
    if (isSubscriptionOpen && !isUserSubscribed) {
      subscribeToMatch(tournamentId, matchId, userId);
    }
  };

  const handleUnsubscribeFromMatch = (
    isSubscriptionOpen,
    isUserSubscribed,
    tournamentId,
    matchId,
    userId,
    playerId
  ) => {
    if (playerId === userId && isSubscriptionOpen && isUserSubscribed) {
      unsubscribeFromMatch(tournamentId, matchId, userId);
    }
  };

  return (
    <PlayerIcon
      image={image}
      isSubscriptionOpen={isSubscriptionOpen}
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
