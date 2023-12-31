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

  const sortedAllMatches = matchesArray
    .slice()
    .sort((a, b) => a.dateTime - b.dateTime);
  const reverseSortedAllMatches = matchesArray.sort(
    (a, b) => b.dateTime - a.dateTime
  );

  const sortedListedAllMatches = sortedAllMatches.map((match, index) => ({
    data: match,
    number: index + 1,
  }));
  const reverseSortedListedAllMatches = sortedListedAllMatches
    .slice()
    .sort((a, b) => b.number - a.number);

  return {
    sortedListedAllMatches: sortedListedAllMatches,
    reverseSortedListedAllMatches: reverseSortedListedAllMatches,
    sortedAllMatches: sortedAllMatches,
    reverseSortedAllMatches: reverseSortedAllMatches,
    sortedUpcomingMatches: sortedUpcomingMatches,
    reverseSortedPreviousMatches: reverseSortedPreviousMatches,
    nextMatch: nextMatch,
    lastMatch: lastMatch,
  };
};

export default separateMatches;
