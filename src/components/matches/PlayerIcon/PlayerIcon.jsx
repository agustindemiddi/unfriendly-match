import { Link } from 'react-router-dom';

import styles from './PlayerIcon.module.css';

const PlayerIcon = ({
  image,
  isSubscriptionOpen,
  isUserSubscribed,
  username,
  playerId,
  tournamentId,
  matchId,
  userId,
  handleSubscribeToMatch,
  handleUnsubscribeFromMatch,
}) => {
  return (
    <>
      {image ? (
        <div className={styles.playerIconContainer}>
          {isSubscriptionOpen && playerId === userId && (
            <div
              className={`${styles.unsubscribe} ${
                isUserSubscribed ? styles.unsubscribeIsUserSubscribed : ''
              }`}
              onClick={() =>
                handleUnsubscribeFromMatch(
                  isSubscriptionOpen,
                  isUserSubscribed,
                  tournamentId,
                  matchId,
                  userId,
                  playerId
                )
              }>
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
            isSubscriptionOpen ? styles.noPlayerContainerIsSubscriptionOpen : ''
          } ${
            isUserSubscribed ? styles.noPlayerContainerIsUserSubscribed : ''
          }`}
          onClick={() =>
            handleSubscribeToMatch(
              isSubscriptionOpen,
              isUserSubscribed,
              tournamentId,
              matchId,
              userId
            )
          }>
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
