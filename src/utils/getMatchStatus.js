const getMatchStatus = ({
  result,
  dateTime,
  registryDateTime,
  players,
  playerQuota,
  teamAPlayers,
  teamBPlayers,
  mvps,
}) => {
  const currentTime = new Date();

  // match is active/finished derived state >>>
  // will check if needed
  let isActive = true;
  if (Object.keys(result).length !== 0 || currentTime >= dateTime) {
    isActive = false;
  }
  // match is active/finished derived state (end) <<<

  // match registry started derived state >>>
  // will check if needed
  let isRegistryStarted = false;
  if (currentTime >= registryDateTime) {
    isRegistryStarted = true;
  }
  // match registry started derived state (end) <<<

  // match registry ended derived state >>>
  // will check if needed
  let isRegistryEnded = false;
  if (currentTime >= dateTime) {
    isRegistryEnded = true;
  }
  // match registry ended derived state (end) <<<

  // remaining players quota derived state >>>
  let remainingPlayersQuota = playerQuota - players.length;
  // remaining players quota derived state (end) <<<

  // match registry is open/closed derived state >>>
  // will check if needed
  let isRegistryOpen = false;
  if (isRegistryStarted && !isRegistryEnded && remainingPlayersQuota >= 1) {
    isRegistryOpen = true;
  }
  // match registry is open/closed derived state (end) <<<

  // mvps derived state >>>
  const allPlayers = [...teamAPlayers, ...teamBPlayers];
  const mvpPlayers = allPlayers.filter((player) => mvps.includes(player.id));

  let mvpsString;
  if (mvpPlayers.length === 1) {
    mvpsString = `MVP: ${mvpPlayers[0].username}`;
  } else if (mvpPlayers.length > 1) {
    const mvpPlayerNames = mvpPlayers.map((player) => player.username);
    mvpsString = `MVPs: ${mvpPlayerNames.join(', ')}`;
  }
  // mvps derived state (end) <<<

  return {
    isActive,
    isRegistryStarted,
    isRegistryEnded,
    remainingPlayersQuota,
    isRegistryOpen,
    mvpsString,
  };
};

export default getMatchStatus;
