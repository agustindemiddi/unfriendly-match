import styles from './PlayerIcon.module.css';

const PlayerIcon = ({ image }) => {
  return (
    // <article className={styles.item}>
    <div className={styles.imageContainer}>
      <img className={styles.image} src={image} alt='' />
    </div>
    // </article>
  );
};

export default PlayerIcon;
