import styles from './StandingsTable.module.css';

const StandingsTable = () => {
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
