const separateTournaments = (tournamentsArray) => {
  const activeTournaments = tournamentsArray.filter(
    (tournament) => tournament.isActive === true
  );
  const finishedTournaments = tournamentsArray.filter(
    (tournament) => tournament.isActive === false
  );
  return {
    active: activeTournaments,
    finished: finishedTournaments,
  };
};

export default separateTournaments;
