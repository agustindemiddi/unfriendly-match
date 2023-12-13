import { Link } from 'react-router-dom';

import PlayerIcon from '../PlayerIcon/PlayerIcon';

import styles from './SoccerField.module.css';

import formatDate from '../../../utils/formatDate';

const SoccerField = ({
  matchProps: {
    tournament,
    creator,
    admins,
    creationDateTime,
    registryDateTime,
    dateTime,
    address,
    playerQuota,
    players,
    teamA,
    teamB,
    result,
    // mvps,
    isActive,
    isRegistryStarted,
    isRegistryEnded,
    remainingPlayersQuota,
    isRegistryOpen,
    mvpsString,
    tournamentImage,
    registeredPlayers,
    teamAPlayers,
    teamBPlayers,
  },
}) => {
  return (
    <>
      {/* temporary >>> */}
      {isActive ? (
        <h3>This match is active</h3>
      ) : (
        <h3>This match has finished</h3>
      )}

      {isRegistryStarted ? (
        <p style={{ color: 'red' }}>
          Registry to this match has started. You can join now!
        </p>
      ) : (
        <p>Registry to this match didn't start yet</p>
      )}

      {isRegistryEnded ? (
        <p>Registry to this match has ended</p>
      ) : (
        <p>Registry to this match didn't end yet</p>
      )}

      {remainingPlayersQuota === 0 ? (
        <p>This match is full</p>
      ) : (
        <p>Remaining places: {remainingPlayersQuota}. You can join!</p>
      )}

      {isRegistryOpen ? (
        <p>Registry is open. You can join!</p>
      ) : (
        <p>Registry is closed</p>
      )}

      {mvpsString ? <p>{mvpsString}</p> : <p>MVP has not yet been selected</p>}

      <time dateTime={registryDateTime.toISOString()}>
        Registry Starts: {formatDate(registryDateTime)}
      </time>

      <br />
      {/* temporary <<< */}

      <div className={styles.container}>
        <div className={styles.header}>
          <Link to={`/tournaments/${tournament}`} style={{ fontSize: '0' }}>
            <img className={styles.tournamentIcon} src={tournamentImage} />
          </Link>
          <div className={styles.dateTimeLocation}>
            <time dateTime={dateTime.toISOString()}>
              {formatDate(dateTime)}
            </time>
            <p>{address}</p>
          </div>
        </div>

        <div
          className={`${styles.soccerField} ${
            Object.keys(result).length > 0 ? styles.isFinishedMatch : ''
          }`}>
          {Object.keys(result).length === 0 && (
            <ul className={`${styles.matchPlayers}`}>
              {registeredPlayers &&
                registeredPlayers.length > 0 &&
                registeredPlayers.map((player) => (
                  <li key={player.id}>
                    <Link to={`/${player.id}`}>
                      <PlayerIcon image={player.image} />
                    </Link>
                  </li>
                ))}
              {remainingPlayersQuota > 0 &&
                [...Array(remainingPlayersQuota)].map((_, index) => (
                  <li key={`empty-${index}`}>
                    <PlayerIcon />
                  </li>
                ))}
            </ul>
          )}

          {Object.keys(result).length > 0 && (
            <>
              <ul className={`${styles.team} ${styles.teamA}`}>
                {teamAPlayers &&
                  teamAPlayers.length > 0 &&
                  teamAPlayers.map((player) => (
                    <li key={player.id}>
                      <Link to={`/${player.id}`}>
                        <PlayerIcon image={player.image} />
                      </Link>
                    </li>
                  ))}
              </ul>
              <div
                className={
                  styles.result
                }>{`${result.teamA} - ${result.teamB}`}</div>
              <ul className={`${styles.team} ${styles.teamB}`}>
                {teamBPlayers &&
                  teamBPlayers.length > 0 &&
                  teamBPlayers.map((player) => (
                    <li key={player.id}>
                      <Link to={`/${player.id}`}>
                        <PlayerIcon image={player.image} />
                      </Link>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>

        {mvpsString && <p className={styles.footer}>{mvpsString}</p>}
      </div>
    </>
  );
};

export default SoccerField;
