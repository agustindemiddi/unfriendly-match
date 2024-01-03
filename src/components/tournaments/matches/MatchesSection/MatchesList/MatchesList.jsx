import MatchItem from './MatchItem/MatchItem';

import styles from './MatchesList.module.css';

const MatchesList = ({ matches }) => {
  return (
    <ul style={{ margin: '2rem' }}>
      {matches.map((match) => (
        <li key={match.id} style={{ margin: '2rem' }}>
          <MatchItem match={match} />
        </li>
      ))}
    </ul>
  );
};

export default MatchesList;
