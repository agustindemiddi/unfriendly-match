import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import styles from './StandingsTable.module.css';

import { getUserAuthCtx } from '../../../../context/authContext';
import { getPlayers } from '../../../../utils/firebase/firestore/firestoreActions';
import { calculateTournamentStats } from '../../../../utils/calculateTournamentStats';

const StandingsTable = () => {
  const { tournamentId } = useParams();
  const { updatedUserTournaments, updatedTournamentMatches } = getUserAuthCtx();
  const [tournamentPlayers, setTournamentPlayers] = useState([]);

  const tournament = updatedUserTournaments?.all?.find(
    (tournament) => tournament.id === tournamentId
  );

  useEffect(() => {
    if (tournament) {
      const fetchTournamentPlayers = async () => {
        const players = await getPlayers(tournament.players);
        setTournamentPlayers(players);
      };
      fetchTournamentPlayers();
    }
  }, [tournament?.players]);

  const finishedMatches = updatedTournamentMatches.filter(
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
                {tournamentPlayers.find((player) => player.id === playerId)
                  ?.displayName || 'N/A'}
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
