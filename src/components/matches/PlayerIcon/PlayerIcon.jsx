import styles from './PlayerIcon.module.css';

const PlayerIcon = ({ image }) => {
  return (
    <>
      {image ? (
        <div className={styles.imageContainer}>
          <img className={styles.image} src={image} alt='Player image' />
        </div>
      ) : (
        <div className={styles.noPlayer} />
      )}
    </>
  );
};

export default PlayerIcon;
