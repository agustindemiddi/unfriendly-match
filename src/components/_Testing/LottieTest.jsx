import Lottie from 'lottie-react'; // using the component
import { useLottie } from 'lottie-react'; // using the hook

import bouncingBall from '../../assets/bouncing-ball.json';

const LottieTest = () => {
  const options = {
    animationData: bouncingBall,
    loop: true,
  };
  const { View } = useLottie(options);

  return (
    <>
      <h2>using the component:</h2>
      <Lottie animationData={bouncingBall} loop={true} />
      <h2>using the hook:</h2>
      <>{View}</>
    </>
  );
};

export default LottieTest;
