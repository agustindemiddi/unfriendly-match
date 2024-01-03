import PlayerIcon from './PlayerIcon';

import { getUserAuthCtx } from '../../../context/authContext';
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
  isTournamentPlayer,
}) => {
  const {
    userPlayerProfile: { id: userId },
  } = getUserAuthCtx();

  const handleSubscribeToMatch = (tournamentId, matchId, userId) => {
    if (!isTournamentPlayer) alert('You must join the tournament first!');
    if (isTournamentPlayer && isSubscriptionOpen && !isUserSubscribed)
      subscribeToMatch(tournamentId, matchId, userId);
  };

  const handleUnsubscribeFromMatch = (tournamentId, matchId, userId) => {
    if (playerId === userId && isSubscriptionOpen && isUserSubscribed)
      unsubscribeFromMatch(tournamentId, matchId, userId);
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
