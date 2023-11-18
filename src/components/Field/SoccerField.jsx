import styles from './SoccerField.module.css';

import soccerField from '../../assets/images/isolated-soccer-field-ball-game-striped-green-background-competitive-sport-lawn-stadium-with-markings_265358-60.avif';

const SoccerField = () => {
  return <img className={styles.image} src={soccerField} alt='Soccer field' />;
};

export default SoccerField;
