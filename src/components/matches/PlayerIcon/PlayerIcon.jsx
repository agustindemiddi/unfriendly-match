import { Link } from 'react-router-dom';

import styles from './PlayerIcon.module.css';

import { getUserAuthCtx } from '../../../context/AuthContext';
import {
  subscribeToMatch,
  unsubscribeFromMatch,
} from '../../../utils/firebase/firestore';

const PlayerIcon = ({
  image,
  isRegistryOpen,
  isUserSubscribed,
  username,
  playerId,
  tournamentId,
  matchId,
}) => {
  const {
    userPlayerProfile: { id: userId },
  } = getUserAuthCtx();

  const handleSubscribeToMatch = (
    isRegistryOpen,
    isUserSubscribed,
    tournamentId,
    matchId,
    userId
  ) => {
    if (isRegistryOpen && !isUserSubscribed) {
      subscribeToMatch(tournamentId, matchId, userId);
    }
  };

  const handleUnsubscribeFromMatch = (
    isRegistryOpen,
    isUserSubscribed,
    tournamentId,
    matchId,
    userId,
    playerId
  ) => {
    if (playerId === userId && isRegistryOpen && isUserSubscribed) {
      unsubscribeFromMatch(tournamentId, matchId, userId);
    }
  };

  return (
    <>
      {image ? (
        <div className={styles.playerIconContainer}>
          {isRegistryOpen && playerId === userId && (
            <div
              className={`${styles.unsubscribe} ${
                isUserSubscribed ? styles.unsubscribeIsUserSubscribed : ''
              }`}
              onClick={() =>
                handleUnsubscribeFromMatch(
                  isRegistryOpen,
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
            isRegistryOpen ? styles.noPlayerContainerIsRegistryOpen : ''
          } ${
            isUserSubscribed ? styles.noPlayerContainerIsUserSubscribed : ''
          }`}
          onClick={() =>
            handleSubscribeToMatch(
              isRegistryOpen,
              isUserSubscribed,
              tournamentId,
              matchId,
              userId
            )
          }>
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
