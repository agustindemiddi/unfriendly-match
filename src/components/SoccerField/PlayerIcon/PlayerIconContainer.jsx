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
  displayName,
  playerId,
  tournamentId,
  matchId,
  isTournamentPlayer,
}) => {
  const { userPlayerProfile } = getUserAuthCtx();

  const handleSubscribeToMatch = async (
    tournamentId,
    matchId,
    userPlayerProfile
  ) => {
    if (!isTournamentPlayer) alert('You must join the tournament first!');
    if (isTournamentPlayer && isSubscriptionOpen && !isUserSubscribed)
      await subscribeToMatch(
        tournamentId,
        matchId,
        userPlayerProfile,
        userPlayerProfile.id
      );
  };

  const handleUnsubscribeFromMatch = async (tournamentId, matchId, userId) => {
    if (playerId === userId && isSubscriptionOpen && isUserSubscribed)
      await unsubscribeFromMatch(tournamentId, matchId, userId);
  };

  return (
    <PlayerIcon
      image={image}
      isSubscriptionOpen={isSubscriptionOpen}
      isUserSubscribed={isUserSubscribed}
      displayName={displayName}
      playerId={playerId}
      tournamentId={tournamentId}
      matchId={matchId}
      userId={userPlayerProfile.id}
      handleSubscribeToMatch={() =>
        handleSubscribeToMatch(
          tournamentId,
          matchId,
          userPlayerProfile,
          userPlayerProfile.id
        )
      }
      handleUnsubscribeFromMatch={() =>
        handleUnsubscribeFromMatch(tournamentId, matchId, userPlayerProfile.id)
      }
    />
  );
};

export default PlayerIconContainer;
