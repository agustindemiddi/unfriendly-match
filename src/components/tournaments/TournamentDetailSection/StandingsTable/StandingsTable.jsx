import styles from './StandingsTable.module.css';

import { getUserAuthCtx } from '../../../../context/authContext';

const StandingsTable = () => {
  const { tournamentMatches } = getUserAuthCtx();

  const finishedMatches = tournamentMatches.filter(
    (match) => Object.keys(match.result).length > 0
  );

  console.log(finishedMatches[0].teamA);

  return (
    <table className={styles.standingsTable}>
      <thead>
        <tr>
          <th>Player</th>
          <th>MP</th>
          <th>Pts</th>
          <th>Avg</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GDiff</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Player 1</td>
          <td>3</td>
          <td>6</td>
          <td>2</td>
          <td>2</td>
          <td>0</td>
          <td>1</td>
          <td>10</td>
        </tr>
        <tr>
          <td>Player 2</td>
          <td>3</td>
          <td>3</td>
          <td>1</td>
          <td>1</td>
          <td>0</td>
          <td>2</td>
          <td>-10</td>
        </tr>
      </tbody>
    </table>
  );
};

export default StandingsTable;
