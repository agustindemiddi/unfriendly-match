import styles from './Match.module.css';

import DUMMY_IMAGE from '../../assets/logo/logo.svg';
import DUMMY_IMAGE2 from '../../assets/images/images.jpeg';
import PlayerIcon from './PlayerIcon';

const Match = () => {
  const date = new Date().toLocaleString();
  const address = 'Martínez';

  const result = '5 - 0';
  const mvp = '';

  const teamA = [
    <PlayerIcon image={DUMMY_IMAGE} id='Coco Jambo1' />,
    <PlayerIcon image={DUMMY_IMAGE2} id='Coco Jambo2' />,
    <PlayerIcon image={DUMMY_IMAGE} id='Coco Jambo3' />,
    <PlayerIcon image={DUMMY_IMAGE} id='Coco Jambo4' />,
    <PlayerIcon image={DUMMY_IMAGE} id='Coco Jambo5' />,
  ];
  const teamB = [
    <PlayerIcon image={DUMMY_IMAGE} id='Coco Jambo6' />,
    <PlayerIcon image={DUMMY_IMAGE} id='Coco Jambo7' />,
    <PlayerIcon image={DUMMY_IMAGE} id='Coco Jambo8' />,
    <PlayerIcon image={DUMMY_IMAGE} id='Coco Jambo9' />,
    <PlayerIcon image={DUMMY_IMAGE} id='Coco Jambo0' />,
  ];

  return (
    <div className={styles.mainDiv}>
      <div className={styles.header}>
        <img
          className={styles.tournament}
          src={DUMMY_IMAGE}
          alt=''
          style={{ width: '36px' }}
        />
        <div className={styles.dateLocation}>
          <time>{date}</time>
          <p>{address}</p>
        </div>
      </div>
      <div className={styles.content}>
        <ul className={`${styles.team} ${styles.teamA}`}>
          {teamA.map((player) => (
            <li key={player.id}>{player}</li>
          ))}
        </ul>
        <div className={styles.result}>{result}</div>
        <ul className={`${styles.team} ${styles.teamB}`}>
          {teamB.map((player) => (
            <li key={player.id}>{player}</li>
          ))}
        </ul>
      </div>
      {mvp ? <div className={styles.footer}>MVP: {mvp}</div> : null}
    </div>
  );
};

export default Match;
