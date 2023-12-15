import styles from './PlayerIcon.module.css';

const PlayerIcon = ({ image, onClick, isRegistryOpen, isUserSubscribed }) => {
  // evaluar si necesito que los onClicks sean reusables o si aplico directo acá (importando) los subscribe y unsubscribe handlers en lugar de traerlos x props
  return (
    <>
      {image ? (
        <div
          className={`${styles.playerIconContainer} ${
            isUserSubscribed ? styles.playerIconContainerIsUserSubscribed : ''
          }`}
          onClick={onClick}>
          <img className={styles.playerIcon} src={image} alt='Player image' />
        </div>
      ) : (
        <div
          className={`${styles.noPlayerContainer} ${
            isRegistryOpen ? styles.noPlayerContainerIsRegistryOpen : ''
          } ${
            isUserSubscribed ? styles.noPlayerContainerIsUserSubscribed : ''
          }`}
          onClick={onClick}>
          {isRegistryOpen && (
            <p className={isUserSubscribed ? styles.isUserSubscribed : ''}>
              in!
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default PlayerIcon;
