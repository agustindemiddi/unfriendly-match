import { Link } from 'react-router-dom';

import styles from './PlayerIcon.module.css';

const PlayerIcon = ({
  image,
  isSubscriptionOpen,
  isUserSubscribed,
  displayName,
  playerId,
  userId,
  handleSubscribeToMatch,
  handleUnsubscribeFromMatch,
  hasUserAdminActions,
}) => {
  return (
    <>
      {image ? (
        <div className={styles.playerIconContainer}>
          {isSubscriptionOpen && (playerId === userId || hasUserAdminActions) && (
            <div
              className={`${styles.unsubscribe} ${
                isUserSubscribed ? styles.unsubscribeIsUserSubscribed : ''
              }`}
              onClick={handleUnsubscribeFromMatch}>
              x
            </div>
          )}
          <img className={styles.playerIcon} src={image} alt='Player image' />
          {displayName ? (
            <Link to={`/${playerId}`}>
              <span className={styles.hidden}>{displayName}</span>
            </Link>
          ) : null}
        </div>
      ) : (
        <div
          className={`${styles.noPlayerContainer} ${
            isSubscriptionOpen ? styles.noPlayerContainerIsSubscriptionOpen : ''
          } ${
            isUserSubscribed ? styles.noPlayerContainerIsUserSubscribed : ''
          }`}
          onClick={handleSubscribeToMatch}>
          {isSubscriptionOpen && (
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
