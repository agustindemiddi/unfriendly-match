import { Link } from 'react-router-dom';

import styles from './MatchField.module.css';

import PlayerIcon from '../PlayerIcon/PlayerIcon';
import DUMMY_IMAGE from '../../../assets/logo/logo.svg';
import DUMMY_IMAGE2 from '../../../assets/images/images.jpeg';

const Match = () => {
  const tournament = '';

  const date = new Date().toLocaleString();
  const address = 'Martínez';

  const result = '5 - 0';
  const mvp = 'Toto';

  const teamA = [
    <PlayerIcon image={DUMMY_IMAGE} />,
    <PlayerIcon image={DUMMY_IMAGE2} />,
    <PlayerIcon image={DUMMY_IMAGE} />,
    <PlayerIcon image={DUMMY_IMAGE} />,
    <PlayerIcon image={DUMMY_IMAGE} />,
  ];
  const teamB = [
    <PlayerIcon image={DUMMY_IMAGE} />,
    <PlayerIcon image={DUMMY_IMAGE} />,
    <PlayerIcon image={DUMMY_IMAGE} />,
    <PlayerIcon image={DUMMY_IMAGE} />,
    <PlayerIcon image={DUMMY_IMAGE} />,
  ];

  return (
    <div className={styles.mainDiv}>
      <div className={styles.header}>
        <Link
          className={styles.tournamentIcon}
          to={`/tournaments/${tournament.id}`}
        >
          <img src={DUMMY_IMAGE} alt='' style={{ width: '36px' }} />
        </Link>
        <div className={styles.dateLocation}>
          <time>{date}</time>
          <p>{address}</p>
        </div>
      </div>
      <div className={styles.content}>
        <ul className={`${styles.team} ${styles.teamA}`}>
          {teamA.map((player) => (
            <li key={player.id}>
              <Link to={`/players/${player.id}`}>{player}</Link>
            </li>
          ))}
        </ul>
        <div className={styles.result}>{result}</div>
        <ul className={`${styles.team} ${styles.teamB}`}>
          {teamB.map((player) => (
            <li key={player.id}>
              <Link to={`/players/${player.id}`}>{player}</Link>
            </li>
          ))}
        </ul>
      </div>
      {mvp ? <div className={styles.footer}>MVP: {mvp}</div> : null}
    </div>
  );
};

export default Match;
