import { Link } from 'react-router-dom';

import PlayerIcon from '../PlayerIcon/PlayerIcon';

import styles from './SoccerField.module.css';

const SoccerField = ({
  matchProps: {
    tournamentId,
    // creator,
    // admins,
    // creationDateTime,
    registryDateTime,
    dateTime,
    address,
    playerQuota,
    result,
    isRegistryStarted,
    isRegistryEnded,
    remainingPlayersQuota,
    isRegistryOpen,
    mvpsString,
    tournamentImage,
    registeredPlayers,
    teams,
    formattedRegistryDateTime,
    formattedDateTime,
    matchSubscriptionCountdown,
    isUserSubscribed,
    matchId,
  },
}) => {
  const { teamA, teamB } = teams;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={`/tournaments/${tournamentId}`} style={{ fontSize: '0' }}>
          <img className={styles.tournamentIcon} src={tournamentImage} />
        </Link>
        <div className={styles.dateTimeLocation}>
          <time dateTime={dateTime.toISOString()}>{formattedDateTime}</time>
          <p>{address}</p>
        </div>
      </div>

      <div
        className={`${styles.soccerField} ${
          isRegistryOpen ? styles.soccerFieldIsRegistryOpen : ''
        }`}>
        {Object.keys(result).length === 0 && (
          <div className={styles.soccerFieldContent}>
            <div className={styles.matchSubscriptionStatus}>
              {!isRegistryStarted && (
                <>
                  <p>Subscription to this match is not open yet</p>
                  <p>
                    Subscription starts:{' '}
                    <time dateTime={registryDateTime.toISOString()}>
                      {formattedRegistryDateTime}
                    </time>
                  </p>
                  <p>Countdown: {matchSubscriptionCountdown}</p>
                </>
              )}
              {isRegistryOpen && (
                <>
                  <p>Subscription to this match is open!</p>
                  <p>Remaining places: {remainingPlayersQuota}</p>
                  <p>You can join this match by clicking here</p>
                </>
              )}
              {isRegistryEnded && Object.keys(result).length === 0 && (
                <>
                  <p>Subscription to this match is closed</p>
                  <p>Awaiting for admin to submit the result</p>
                </>
              )}
            </div>
            <div className={styles.matchPlayersContainer}>
              {!isRegistryStarted && (
                <ul
                  className={`${styles.matchPlayers} ${
                    playerQuota >= 12 ? styles.matchPlayersAlternative : ''
                  }`}>
                  {[...Array(playerQuota)].map((_, index) => (
                    <li
                      className={
                        playerQuota === 12
                          ? styles.playerIconAlternative12P
                          : playerQuota === 14
                          ? styles.playerIconAlternative14P
                          : playerQuota === 16
                          ? styles.playerIconAlternative16P
                          : playerQuota === 18
                          ? styles.playerIconAlternative12P
                          : playerQuota === 22
                          ? styles.playerIconAlternative16P
                          : ''
                      }
                      key={`empty-${index}`}>
                      <PlayerIcon />
                    </li>
                  ))}
                </ul>
              )}
              {isRegistryStarted && (
                <ul
                  className={`${styles.matchPlayers} ${
                    playerQuota >= 12 ? styles.matchPlayersAlternative : ''
                  }`}>
                  {registeredPlayers &&
                    registeredPlayers.length > 0 &&
                    registeredPlayers.map((player) => (
                      <li
                        className={
                          playerQuota === 12
                            ? styles.playerIconAlternative12P
                            : playerQuota === 14
                            ? styles.playerIconAlternative14P
                            : playerQuota === 16
                            ? styles.playerIconAlternative16P
                            : playerQuota === 18
                            ? styles.playerIconAlternative12P
                            : playerQuota === 22
                            ? styles.playerIconAlternative16P
                            : ''
                        }
                        key={player.id}>
                        {isRegistryOpen ? (
                          <PlayerIcon
                            image={player.image}
                            isUserSubscribed={isUserSubscribed}
                            username={player.username}
                            playerId={player.id}
                            isRegistryOpen={isRegistryOpen}
                            tournamentId={tournamentId}
                            matchId={matchId}
                          />
                        ) : (
                          <PlayerIcon
                            image={player.image}
                            username={player.username}
                          />
                        )}
                      </li>
                    ))}
                  {remainingPlayersQuota > 0 &&
                    [...Array(remainingPlayersQuota)].map((_, index) => (
                      <li
                        className={
                          playerQuota === 12
                            ? styles.playerIconAlternative12P
                            : playerQuota === 14
                            ? styles.playerIconAlternative14P
                            : playerQuota === 16
                            ? styles.playerIconAlternative16P
                            : playerQuota === 18
                            ? styles.playerIconAlternative12P
                            : playerQuota === 22
                            ? styles.playerIconAlternative16P
                            : ''
                        }
                        key={`empty-${index}`}>
                        <PlayerIcon
                          isRegistryOpen={isRegistryOpen}
                          isUserSubscribed={isUserSubscribed}
                          tournamentId={tournamentId}
                          matchId={matchId}
                        />
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {Object.keys(result).length > 0 && (
          <div className={styles['soccerFieldContent-isFinishedMatch']}>
            <ul className={styles.team}>
              {teamA &&
                teamA.length > 0 &&
                teamA.map((player) => (
                  <li key={player.id}>
                    <PlayerIcon
                      image={player.image}
                      username={player.username}
                    />
                  </li>
                ))}
            </ul>

            <div className={styles.resultContainer}>
              <div className={styles.resultTeam}>{result.teamA}</div>
              <div className={styles.resultSeparator}>-</div>
              <div className={`${styles.resultTeam} ${styles.resultTeamB}`}>
                {result.teamB}
              </div>
            </div>

            <ul className={`${styles.team} ${styles.teamB}`}>
              {teamB &&
                teamB.length > 0 &&
                teamB.map((player) => (
                  <li key={player.id}>
                    <PlayerIcon
                      image={player.image}
                      username={player.username}
                    />
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {mvpsString && <p className={styles.footer}>{mvpsString}</p>}
    </div>
  );
};

export default SoccerField;
