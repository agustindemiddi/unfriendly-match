import Lottie from 'lottie-react';

import styles from './LoadingBouncingSoccerBall.module.css';

import bouncingBall from '../../../assets/bouncing-ball.json';

const LoadingBouncingSoccerBall = () => {
  return (
    <Lottie
      className={styles.loadingBouncingSoccerBall}
      animationData={bouncingBall}
      loop={true}
    />
  );
};

export default LoadingBouncingSoccerBall;
