export const calculateTournamentStats = (tournamentMatches) => {
  const updatePlayerStats = (
    playerId,
    teamGoals,
    opponentGoals,
    playerStats
  ) => {
    if (!playerStats[playerId]) {
      playerStats[playerId] = {
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        loses: 0,
        goalsDifference: 0,
      };
    }

    playerStats[playerId].matchesPlayed += 1;

    if (teamGoals > opponentGoals) {
      playerStats[playerId].wins += 1;
    } else if (teamGoals < opponentGoals) {
      playerStats[playerId].loses += 1;
    } else {
      playerStats[playerId].draws += 1;
    }

    playerStats[playerId].goalsDifference += teamGoals - opponentGoals;
  };

  const calculatePlayersStats = (matches) => {
    const playerStats = {};

    matches.forEach((match) => {
      match.teamA.forEach((playerId) => {
        updatePlayerStats(
          playerId,
          match.result.teamA,
          match.result.teamB,
          playerStats
        );
      });

      match.teamB.forEach((playerId) => {
        updatePlayerStats(
          playerId,
          match.result.teamB,
          match.result.teamA,
          playerStats
        );
      });
    });

    const playersStats = Object.entries(playerStats).map(
      ([playerId, stats]) => {
        const { wins, draws, loses, goalsDifference, matchesPlayed } = stats;
        const points = wins * 3 + draws;
        const average = matchesPlayed
          ? (points / matchesPlayed) % 1 !== 0
            ? parseFloat((points / matchesPlayed).toFixed(2))
            : parseFloat(points / matchesPlayed)
          : 0;

        return {
          [playerId]: {
            matchesPlayed,
            wins,
            draws,
            loses,
            goalsDifference,
            points,
            average,
          },
        };
      }
    );

    return playersStats;
  };

  const playersStats = calculatePlayersStats(tournamentMatches);

  const sortedPlayersStats = [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];

    if (statsB.points !== statsA.points) {
      return statsB.points - statsA.points;
    }

    return statsB.goalsDifference - statsA.goalsDifference;
  });

  return sortedPlayersStats;
};
