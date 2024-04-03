export const sortByPoints = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];

    if (statsB.points !== statsA.points) {
      return statsB.points - statsA.points;
    }

    if (statsB.goalDifference !== statsA.goalDifference) {
      return statsB.goalDifference - statsA.goalDifference;
    }

    return statsB.average - statsA.average;
  });

export const sortReverseByPoints = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];

    if (statsA.points !== statsB.points) {
      return statsA.points - statsB.points;
    }

    if (statsA.goalDifference !== statsB.goalDifference) {
      return statsA.goalDifference - statsB.goalDifference;
    }

    return statsA.average - statsB.average;
  });

export const sortByGoalDifference = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsB.goalDifference - statsA.goalDifference;
  });

export const sortReverseByGoalDifference = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsA.goalDifference - statsB.goalDifference;
  });

export const sortByAverage = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsB.average - statsA.average;
  });

export const sortReverseByAverage = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsA.average - statsB.average;
  });

export const sortByMatchesPlayed = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsB.matchesPlayed - statsA.matchesPlayed;
  });

export const sortReverseByMatchesPlayed = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsA.matchesPlayed - statsB.matchesPlayed;
  });

export const sortByWins = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsB.wins - statsA.wins;
  });

export const sortReverseByWins = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsA.wins - statsB.wins;
  });

export const sortByDraws = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsB.draws - statsA.draws;
  });

export const sortReverseByDraws = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsA.draws - statsB.draws;
  });

export const sortByLoses = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsB.loses - statsA.loses;
  });

export const sortReverseByLoses = (playersStats) =>
  [...playersStats].sort((a, b) => {
    const statsA = Object.values(a)[0];
    const statsB = Object.values(b)[0];
    return statsA.loses - statsB.loses;
  });
