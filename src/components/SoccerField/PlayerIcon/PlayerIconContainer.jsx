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
  isAdmin,
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
        userPlayerProfile.id,
        userPlayerProfile
      );
  };

  const handleUnsubscribeFromMatch = async (tournamentId, matchId, userId) => {
    if (isSubscriptionOpen && (playerId === userId && isUserSubscribed) || isAdmin)
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
      userId={userPlayerProfile?.id}
      handleSubscribeToMatch={() =>
        handleSubscribeToMatch(
          tournamentId,
          matchId,
          userPlayerProfile,
          userPlayerProfile.id
        )
      }
      handleUnsubscribeFromMatch={() =>
        handleUnsubscribeFromMatch(tournamentId, matchId, playerId)
      }
      isAdmin={isAdmin}
    />
  );
};

export default PlayerIconContainer;
