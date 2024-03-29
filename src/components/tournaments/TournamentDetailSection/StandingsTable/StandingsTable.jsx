import styles from './StandingsTable.module.css';

import { calculateTournamentStats } from '../../../../utils/calculateTournamentStats';

// const StandingsTable = ({ matches, players }) => {
const StandingsTable = ({ matches, activePlayers, inactivePlayers }) => {
  const finishedMatches = matches.filter(
    (match) => Object.keys(match.result).length > 0
  );

  const tournamentStats = calculateTournamentStats(finishedMatches);

  const allPlayers = [...activePlayers, ...inactivePlayers]; // allPlayers includes all inactive players except nonVerifiedPlayers that where deleted due to non belonging to any tournament so they were deleted from DB

  const currentTournamentPlayers = tournamentStats.filter((player) =>
    allPlayers.some((allPlayer) => allPlayer.id === Object.keys(player)[0])
  );

  return (
    <table className={styles.standingsTable}>
      <thead>
        <tr>
          <th>Player</th>
          <th>Matches Played</th>
          <th>Points</th>
          <th>Average</th>
          <th>Wins</th>
          <th>Draws</th>
          <th>Loses</th>
          <th>Goals Difference</th>
        </tr>
      </thead>
      <tbody>
        {currentTournamentPlayers.map((playerStats, index) => {
          const playerId = Object.keys(playerStats)[0];
          const {
            matchesPlayed,
            points,
            average,
            wins,
            draws,
            loses,
            goalsDifference,
          } = Object.values(playerStats)[0];

          return (
            <tr key={index}>
              <td>
                {
                  allPlayers.find((player) => player.id === playerId)
                    ?.displayName
                }
              </td>
              <td>{matchesPlayed}</td>
              <td>{points}</td>
              <td>{average}</td>
              <td>{wins}</td>
              <td>{draws}</td>
              <td>{loses}</td>
              <td>{goalsDifference}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StandingsTable;
