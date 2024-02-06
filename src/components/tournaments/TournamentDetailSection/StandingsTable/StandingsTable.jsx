import styles from './StandingsTable.module.css';

import { calculateTournamentStats } from '../../../../utils/calculateTournamentStats';

const StandingsTable = ({ matches, players }) => {
  const finishedMatches = matches.filter(
    (match) => Object.keys(match.result).length > 0
  );

  const tournamentStats = calculateTournamentStats(finishedMatches);

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
        {tournamentStats.map((playerStats, index) => {
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
                {players.find((player) => player.id === playerId)?.displayName}
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
