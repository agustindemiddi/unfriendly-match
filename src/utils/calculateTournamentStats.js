import { sortByPoints } from '../utils/sortTournamentStats';

export const calculateTournamentStats = (tournamentMatches) => {
  const totalMatches = tournamentMatches.length;

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
        goalDifference: 0,
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

    playerStats[playerId].goalDifference += teamGoals - opponentGoals;
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
        const { wins, draws, loses, goalDifference, matchesPlayed } = stats;
        const points = wins * 3 + draws;
        const average = matchesPlayed
          ? (points / matchesPlayed) % 1 !== 0
            ? (points / matchesPlayed).toFixed(2)
            : points / matchesPlayed
          : 0;
        const playedMatchesPercentage = matchesPlayed
          ? ((matchesPlayed / totalMatches) * 100) % 1 !== 0
            ? ((matchesPlayed / totalMatches) * 100).toFixed(2)
            : (matchesPlayed / totalMatches) * 100
          : 0;

        return {
          [playerId]: {
            matchesPlayed,
            playedMatchesPercentage,
            points,
            average,
            wins,
            draws,
            loses,
            goalDifference,
          },
        };
      }
    );

    return playersStats;
  };

  const playersStats = calculatePlayersStats(tournamentMatches);

  return sortByPoints(playersStats);
};

export const getTournamentResults = (
  championStats,
  goldenBootStats,
  // // mvpStats,
  // poopChampionStats,
  poopBootStats
) => {
  // console.log('championStats', championStats);
  return {
    results: {
      champion: {
        id: Object.keys(championStats)[0],
        points: Object.values(championStats)[0].points,
        matches: Object.values(championStats)[0].matchesPlayed,
      },
      goldenBoot: {
        id: Object.keys(goldenBootStats)[0],
        goalDifference: Object.values(goldenBootStats)[0].goalDifference,
        matches: Object.values(goldenBootStats)[0].matchesPlayed,
      },
      // // mvp: {
      // //   id: Object.keys(mvpStats)[0],
      // //   mvpTimes: Object.values(mvpStats)[0].mvpTimes,
      // //   matches: Object.values(mvpStats)[0].matchesPlayed,
      // // },
      // poopChampion: {
      //   id: Object.keys(poopChampionStats)[0],
      //   points: Object.values(poopChampionStats)[0].points,
      //   matches: Object.values(poopChampionStats)[0].matchesPlayed,
      // },
      poopBoot: {
        id: Object.keys(poopBootStats)[0],
        goalDifference: Object.values(poopBootStats)[0].goalDifference,
        matches: Object.values(poopBootStats)[0].matchesPlayed,
      },
    },
    isActive: false,
  };
};
