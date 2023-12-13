const separateMatches = (matchesArray) => {
  const currentDate = new Date();
  const sortedUpcomingMatches = matchesArray
    .filter((match) => match.dateTime >= currentDate)
    .sort((a, b) => a.dateTime - b.dateTime);
  const reverseSortedPreviousMatches = matchesArray
    .filter((match) => match.dateTime < currentDate)
    .sort((a, b) => b.dateTime - a.dateTime);
  const nextMatch = sortedUpcomingMatches[0];
  const lastMatch = reverseSortedPreviousMatches[0];
  return {
    sortedUpcomingMatches: sortedUpcomingMatches,
    reverseSortedPreviousMatches: reverseSortedPreviousMatches,
    nextMatch: nextMatch,
    lastMatch: lastMatch,
  };
};

export default separateMatches;
