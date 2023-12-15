import { Link } from 'react-router-dom';

import styles from './PlayerIcon.module.css';

const PlayerIcon = ({
  image,
  onClick,
  isRegistryOpen,
  isUserSubscribed,
  username,
  playerId,
  // evaluar si es mejor traer userId desde props o desde getUserAuthCtx()
  userId,
}) => {
  // evaluar si necesito que los onClicks sean reusables o si aplico directo acá (importando) los subscribe y unsubscribe handlers en lugar de traerlos x props

  return (
    <>
      {image ? (
        <div className={styles.playerIconContainer}>
          {isRegistryOpen && playerId === userId && (
            <div
              className={`${styles.delete} ${
                isUserSubscribed ? styles.deleteIsUserSubscribed : ''
              }`}
              onClick={() => onClick(playerId)}>
              x
            </div>
          )}
          <img className={styles.playerIcon} src={image} alt='Player image' />
          {username ? (
            <Link to={`/${playerId}`}>
              <span className={styles.hidden}>{username}</span>
            </Link>
          ) : null}
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
