import styles from './PlayerIcon.module.css';

const PlayerIcon = ({ image, onClick, isRegistryOpen, isUserSubscribed }) => {
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
          } ${
            isUserSubscribed ? styles.noPlayerContainerIsUserSubscribed : ''
          }`}
          onClick={isRegistryOpen ? onClick : null}>
          {isRegistryOpen && (
            <p
              className={`${isRegistryOpen ? styles.subscribe : null} ${
                isUserSubscribed ? styles.isUserSubscribed : ''
              }`}>
              in!
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default PlayerIcon;
