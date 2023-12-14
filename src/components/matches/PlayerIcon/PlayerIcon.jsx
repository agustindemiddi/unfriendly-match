import styles from './PlayerIcon.module.css';

const PlayerIcon = ({ image, onClick, isRegistryOpen }) => {
  return (
    <>
      {image ? (
        <div className={styles.playerIconContainer}>
          <img className={styles.playerIcon} src={image} alt='Player image' />
        </div>
      ) : (
        <div
          className={`${styles.noPlayerContainer} ${
            isRegistryOpen ? styles.noPlayerContainerIsRegistryOpen : ''
          }`}
          onClick={isRegistryOpen ? onClick : null}>
          {isRegistryOpen && (
            <p className={isRegistryOpen ? styles.suscribe : null}>in!</p>
          )}
        </div>
      )}
    </>
  );
};

export default PlayerIcon;
