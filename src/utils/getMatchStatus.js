const getMatchStatus = ({
  result,
  registryDateTime,
  dateTime,
  playerQuota,
  players,
  teamAPlayers,
  teamBPlayers,
  mvps,
  userPlayerId,
}) => {
  const currentTime = new Date();

  // match subscription started derived state:
  let isRegistryStarted = currentTime >= registryDateTime;

  // match subscription ended derived state:
  let isRegistryEnded = currentTime >= dateTime;

  // remaining players quota derived state:
  let remainingPlayersQuota = playerQuota - players.length;

  // match subscription is open/closed derived state:
  let isRegistryOpen =
    isRegistryStarted &&
    !isRegistryEnded &&
    remainingPlayersQuota >= 1 &&
    Object.keys(result).length === 0;

  // mvps derived state:
  const allPlayers = [...teamAPlayers, ...teamBPlayers];
  const mvpPlayers = allPlayers.filter((player) => mvps.includes(player.id));
  let mvpsString;
  if (mvpPlayers.length === 1) {
    mvpsString = `MVP: ${mvpPlayers[0].username}`;
  } else if (mvpPlayers.length > 1) {
    const mvpPlayerNames = mvpPlayers.map((player) => player.username);
    mvpsString = `MVPs: ${mvpPlayerNames.join(', ')}`;
  }

  // user is subscribed to match derived state:
  let isUserSubscribed = players.some((playerId) => playerId === userPlayerId);

  return {
    isRegistryStarted,
    isRegistryEnded,
    remainingPlayersQuota,
    isRegistryOpen,
    mvpsString,
    isUserSubscribed,
  };
};

export default getMatchStatus;
