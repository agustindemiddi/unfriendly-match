import { Link } from 'react-router-dom';

import styles from './PlayerIcon.module.css';

const PlayerIcon = ({
  image,
  onClick,
  isRegistryOpen,
  isUserSubscribed,
  username,
  playerId,
  userId,
}) => {
  return (
    <>
      {image ? (
        <div className={styles.playerIconContainer}>
          {isRegistryOpen && playerId === userId && (
            <div
              className={`${styles.unsubscribe} ${
                isUserSubscribed ? styles.unsubscribeIsUserSubscribed : ''
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
