import styles from './StandingsTable.module.css';

const StandingsTable = ({
  totalMatches,
  requiredParticipation,
  currentTournamentPlayers,
  allPlayers,
}) => {
  return (
    <>
      {/* temporary header style; change! */}
      <header className={styles.standingsTable}>
        Total tournament matches: {totalMatches} // Championship required:{' '}
        {requiredParticipation}%
      </header>
      <table className={styles.standingsTable}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Matches Played</th>
            {/* <th>Matches Played %</th> */}
            <th>Points</th>
            {/* <th>Average</th> */}
            <th>Wins</th>
            <th>Draws</th>
            <th>Loses</th>
            <th>Goal Difference</th>
          </tr>
        </thead>
        <tbody>
          {currentTournamentPlayers.map((playerStats, index) => {
            const playerId = Object.keys(playerStats)[0];
            const {
              matchesPlayed,
              playedMatchesPercentage,
              points,
              // average,
              wins,
              draws,
              loses,
              goalDifference,
            } = Object.values(playerStats)[0];

            return (
              // <tr key={index}>
              <tr
                key={index}
                className={
                  playedMatchesPercentage > requiredParticipation
                    ? styles.reach
                    : styles.unreach
                }>
                <td>
                  {
                    allPlayers.find((player) => player.id === playerId)
                      ?.displayName
                  }
                </td>
                <td>
                  {matchesPlayed} ({Math.ceil(playedMatchesPercentage)}%)
                </td>
                {/* <td>{matchesPlayed}</td> */}
                {/* <td>{Math.ceil(playedMatchesPercentage)}%</td> */}
                <td>{points}</td>
                {/* <td>{average}</td> */}
                <td>{wins}</td>
                <td>{draws}</td>
                <td>{loses}</td>
                <td>{goalDifference}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default StandingsTable;
