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

  // match subscription started derived state:
  let isSubscriptionStarted = currentTime >= subscriptionDateTime;

  // match subscription ended derived state:
  let isSubscriptionEnded = currentTime >= dateTime;

  // remaining players quota derived state:
  let remainingPlayersQuota = playerQuota - sortedUpdatedMatchPlayers.length;

  // match subscription is open/closed derived state:
  let isSubscriptionOpen =
    isSubscriptionStarted &&
    !isSubscriptionEnded &&
    remainingPlayersQuota >= 1 &&
    Object.keys(result).length === 0;

  // mvps derived state:
  const allPlayers = [...teams.teamA, ...teams.teamB];
  const mvpPlayers = allPlayers.filter((player) => mvps.includes(player.id));
  let mvpsString;
  if (mvpPlayers.length === 1) {
    mvpsString = `MVP: ${mvpPlayers[0].displayName}`;
  } else if (mvpPlayers.length > 1) {
    const mvpPlayerNames = mvpPlayers.map((player) => player.displayName);
    mvpsString = `MVPs: ${mvpPlayerNames.join(', ')}`;
  }

  // user is subscribed to match derived state:
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
