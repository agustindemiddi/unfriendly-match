const getMatchStatus = ({
  result,
  subscriptionDateTime,
  dateTime,
  playerQuota,
  sortedUpdatedMatchPlayers,
  teams,
  mvps,
  userId,
}) => {
  const currentTime = new Date();

  let isSubscriptionStarted = currentTime >= subscriptionDateTime;

  let isSubscriptionEnded = currentTime >= dateTime;

  let remainingPlayersQuota = playerQuota - sortedUpdatedMatchPlayers.length;

  let isSubscriptionOpen =
    isSubscriptionStarted &&
    !isSubscriptionEnded &&
    remainingPlayersQuota >= 1 &&
    Object.keys(result).length === 0;

  const allPlayers = [...teams.teamA, ...teams.teamB];
  const mvpPlayers = allPlayers.filter((player) => mvps.includes(player.id));
  let mvpsString;
  if (mvpPlayers.length === 1) {
    mvpsString = `MVP: ${mvpPlayers[0].displayName}`;
  } else if (mvpPlayers.length > 1) {
    const mvpPlayerNames = mvpPlayers.map((player) => player.displayName);
    mvpsString = `MVPs: ${mvpPlayerNames.join(', ')}`;
  }

  let isUserSubscribed = sortedUpdatedMatchPlayers.some(
    (player) => player.id === userId
  );

  return {
    isSubscriptionStarted,
    isSubscriptionEnded,
    remainingPlayersQuota,
    isSubscriptionOpen,
    mvpsString,
    isUserSubscribed,
  };
};

export default getMatchStatus;
