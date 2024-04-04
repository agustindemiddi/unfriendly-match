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
  isUserTournamentPlayer,
  isUserTournamentCreator,
  isUserTournamentAdmin,
  isUserMatchCreator,
  isUserMatchAdmin,
  tournamentCreator,
  tournamentAdmins,
  matchCreator,
  matchAdmins,
}) => {
  const { userPlayerProfile } = getUserAuthCtx();

  const hasUserAdminActions =
    isUserTournamentCreator ||
    (isUserTournamentAdmin &&
      tournamentCreator !== playerId &&
      !tournamentAdmins.includes(playerId)) ||
    (isUserMatchCreator &&
      tournamentCreator !== playerId &&
      !tournamentAdmins.includes(playerId)) ||
    (isUserMatchAdmin &&
      tournamentCreator !== playerId &&
      !tournamentAdmins.includes(playerId) &&
      matchCreator !== playerId &&
      !matchAdmins.includes(playerId));

  const handleSubscribeToMatch = async (
    tournamentId,
    matchId,
    userPlayerProfile
  ) => {
    if (!isUserTournamentPlayer) {
      alert('You must join the tournament first!');
    } else if (isSubscriptionOpen && !isUserSubscribed) {
      await subscribeToMatch(
        tournamentId,
        matchId,
        userPlayerProfile.id,
        userPlayerProfile
      );
    }
  };

  const handleUnsubscribeFromMatch = async (tournamentId, matchId, userId) => {
    if (
      isSubscriptionOpen &&
      // ((playerId === userId && isUserSubscribed) || hasUserAdminActions) // check if '&& isUserSubscribed' is redundant
      (playerId === userId || hasUserAdminActions)
    )
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
      hasUserAdminActions={hasUserAdminActions}
    />
  );
};

export default PlayerIconContainer;
