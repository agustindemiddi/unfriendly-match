import { Link } from 'react-router-dom';

import PlayerIconContainer from './PlayerIcon/PlayerIconContainer';

import styles from './SoccerField.module.css';

const SoccerField = ({
  matchProps: {
    tournamentId,
    // creationDateTime,
    subscriptionDateTime,
    dateTime,
    address,
    playerQuota,
    result,
    isSubscriptionStarted,
    isSubscriptionEnded,
    remainingPlayersQuota,
    isSubscriptionOpen,
    mvpsString,
    tournamentImage,
    sortedUpdatedMatchPlayers,
    teams,
    formattedSubscriptionDateTime,
    formattedDateTime,
    matchSubscriptionCountdown,
    isUserSubscribed,
    matchId,
    isUserTournamentPlayer,
    isUserTournamentCreator,
    isUserTournamentAdmin,
    isUserMatchCreator,
    isUserMatchAdmin,
    tournamentCreator,
    tournamentAdmins,
    matchCreator,
    matchAdmins,
    handleDeleteMatch,
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

      {(isUserTournamentCreator || // check later with matchCreator and matchAdmin w/o being userTournamentAdmin
        isUserTournamentAdmin ||
        isUserMatchCreator ||
        isUserMatchAdmin) && (
        <button onClick={handleDeleteMatch}>Delete match</button>
      )}

      <div
        className={`${styles.soccerField} ${
          isSubscriptionOpen ? styles.soccerFieldIsSubscriptionOpen : ''
        }`}>
        {Object.keys(result).length === 0 && (
          <div className={styles.soccerFieldContent}>
            <div className={styles.matchSubscriptionStatus}>
              {!isSubscriptionStarted && (
                <>
                  <p>Subscription to this match is not open yet</p>
                  <p>
                    Subscription starts:{' '}
                    <time dateTime={subscriptionDateTime.toISOString()}>
                      {formattedSubscriptionDateTime}
                    </time>
                  </p>
                  <p>Countdown: {matchSubscriptionCountdown}</p>
                </>
              )}
              {isSubscriptionOpen && (
                <>
                  <p>Subscription to this match is open!</p>
                  <p>Remaining places: {remainingPlayersQuota}</p>
                  <p>You can join this match by clicking here</p>
                </>
              )}
              {isSubscriptionEnded && (
                <>
                  <p>Subscription to this match is closed</p>
                  <p>Awaiting for admin to submit the result</p>
                </>
              )}
            </div>
            <div className={styles.matchPlayersContainer}>
              {!isSubscriptionStarted && (
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
                      <PlayerIconContainer
                        isUserTournamentPlayer={isUserTournamentPlayer}
                      />
                    </li>
                  ))}
                </ul>
              )}
              {isSubscriptionStarted && (
                <ul
                  className={`${styles.matchPlayers} ${
                    playerQuota >= 12 ? styles.matchPlayersAlternative : ''
                  }`}>
                  {sortedUpdatedMatchPlayers &&
                    sortedUpdatedMatchPlayers.length > 0 &&
                    sortedUpdatedMatchPlayers.map((player) => (
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
                        {isSubscriptionOpen ? (
                          <PlayerIconContainer
                            image={player.image}
                            isSubscriptionOpen={isSubscriptionOpen}
                            isUserSubscribed={isUserSubscribed}
                            displayName={player.displayName}
                            playerId={player.id}
                            tournamentId={tournamentId}
                            matchId={matchId}
                            isUserTournamentPlayer={isUserTournamentPlayer}
                            isUserTournamentCreator={isUserTournamentCreator}
                            isUserTournamentAdmin={isUserTournamentAdmin}
                            isUserMatchCreator={isUserMatchCreator}
                            isUserMatchAdmin={isUserMatchAdmin}
                            tournamentCreator={tournamentCreator}
                            tournamentAdmins={tournamentAdmins}
                            matchCreator={matchCreator}
                            matchAdmins={matchAdmins}
                          />
                        ) : (
                          <PlayerIconContainer
                            image={player.image}
                            displayName={player.displayName}
                            playerId={player.id}
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
                        <PlayerIconContainer
                          isSubscriptionOpen={isSubscriptionOpen}
                          isUserSubscribed={isUserSubscribed}
                          tournamentId={tournamentId}
                          matchId={matchId}
                          isUserTournamentPlayer={isUserTournamentPlayer}
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
                    <PlayerIconContainer
                      image={player.image}
                      displayName={player.displayName}
                      playerId={player.id}
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
                    <PlayerIconContainer
                      image={player.image}
                      displayName={player.displayName}
                      playerId={player.id}
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
