import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './MatchForm.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import {
  getPlayers,
  addMatch,
  subscribeToMatch,
} from '../../../utils/firebase/firestore/firestoreActions';

const MatchForm = () => {
  const { tournamentId } = useParams();
  const { userPlayerProfile, updatedUserTournaments } = getUserAuthCtx();
  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];
  const [matchPlayers, setMatchPlayers] = useState([]);
  const [tournamentAvailablePlayers, setTournamentAvailablePlayers] = useState(
    []
  );
  const [typeOfMatch, setTypeOfMatch] = useState(5);

  const matchDateInputRef = useRef();
  const matchTimeInputRef = useRef();
  const matchAddressInputRef = useRef();
  const matchSubscriptionStartDateInputRef = useRef();
  const matchSubscriptionStartTimeInputRef = useRef();
  // const playerQuotaInputRef = useRef();

  useEffect(() => {
    if (tournament) {
      const fetchPlayers = async () => {
        const playersArrayWithUserPlayer = await getPlayers(tournament.players);
        const playersArray = playersArrayWithUserPlayer.filter(
          (player) => player.id !== userPlayerProfile.id
        );
        setTournamentAvailablePlayers(playersArray);
        setMatchPlayers([userPlayerProfile]);
      };
      fetchPlayers();
    }
  }, [tournament]);

  useEffect(() => {
    tournament?.defaultPlayerQuota &&
      setTypeOfMatch(tournament.defaultPlayerQuota / 2);
  }, [tournament?.defaultPlayerQuota]);

  const typeOptions = Array.from({ length: 11 }, (_, index) => index + 1);

  const handleSelectType = (number) => {
    setTypeOfMatch(number);
  };

  const handleAddPlayerToThisMatch = (player) => {
    setMatchPlayers((prevState) => [...prevState, player]);

    setTournamentAvailablePlayers((prevState) =>
      prevState.filter(
        (tournamentAvailablePlayer) =>
          tournamentAvailablePlayer.id !== player.id
      )
    );
  };

  const handleDeletePlayerFromThisMatch = (player) => {
    setTournamentAvailablePlayers((prevState) => [...prevState, player]);

    setMatchPlayers((prevState) =>
      prevState.filter((matchPlayer) => matchPlayer.id !== player.id)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const matchDate = matchDateInputRef.current.value;
    const matchTime = matchTimeInputRef.current.value;
    const matchCombinedDateTime = `${matchDate}T${matchTime}`;
    const matchDateTime = new Date(matchCombinedDateTime);

    const matchSubscriptionDate =
      matchSubscriptionStartDateInputRef.current.value;
    const matchSubscriptionTime =
      matchSubscriptionStartTimeInputRef.current.value;
    const matchSubscriptionCombinedDateTime = `${matchSubscriptionDate}T${matchSubscriptionTime}`;
    const matchSubscriptionDateTime = new Date(
      matchSubscriptionCombinedDateTime
    );

    const matchData = {
      tournament: tournamentId,
      creator: userPlayerProfile.id,
      admins: tournament.admins,
      creationDateTime: new Date(),
      subscriptionDateTime: matchSubscriptionDateTime, // custom or Timestamp.now() (default value)
      dateTime: matchDateTime,
      address: matchAddressInputRef.current.value,
      playerQuota: typeOfMatch * 2,
      teamA: [],
      teamB: [],
      result: {},
      mvps: [],
    };

    const matchId = uuidv4();
    await addMatch(tournamentId, matchId, matchData);

    await Promise.all(
      matchPlayers.map(async (player) => {
        const playerData = {
          ...player,
          subscriptionDateTime: new Date(),
          subscribedBy: userPlayerProfile.id,
        };
        await subscribeToMatch(tournamentId, matchId, playerData);
      })
    );

    console.log('match added!');
  };

  return (
    <form className={styles.matchForm} onSubmit={handleSubmit}>
      <fieldset>
        <legend>Match day:</legend>
        <input
          type='date'
          name='match-date'
          // defaultValue={'proximo dia de la semana x default'}
          ref={matchDateInputRef}
          required
        />
      </fieldset>

      <fieldset>
        <legend>Match time:</legend>
        <input
          type='time'
          name='match-time'
          // defaultValue={'horario x default'}
          ref={matchTimeInputRef}
          required
        />
      </fieldset>

      <fieldset>
        <input
          name='match-address'
          placeholder='Address'
          defaultValue={tournament?.defaultAddress}
          ref={matchAddressInputRef}
        />
      </fieldset>

      <fieldset>
        <legend>Match subscription starts on:</legend>
        <input
          type='date'
          name='match-subscription-date'
          /// defaultValue={'dia suscription x default'}
          ref={matchSubscriptionStartDateInputRef}
          required
        />
      </fieldset>

      <fieldset>
        <legend>at:</legend>
        <input
          type='time'
          name='match-subscription-time'
          // defaultValue={'horario suscription x default'}
          ref={matchSubscriptionStartTimeInputRef}
          required
        />
      </fieldset>

      <fieldset className={styles.type}>
        <legend>Select type of match:</legend>
        <div>
          {typeOptions.map((number) => (
            <button
              type='button'
              key={number}
              className={
                number === typeOfMatch ? styles.selectedTypeOfMatch : ''
              }
              onClick={() => handleSelectType(number)}>
              {`F${number}`}
            </button>
          ))}
        </div>
        <legend>{typeOfMatch} players per team</legend>
      </fieldset>

      <fieldset className={styles.subscribePlayersToMatch}>
        <legend> Subscribe players to this match:</legend>
        {matchPlayers && (
          <ul>
            {matchPlayers.map((player) => (
              <li
                key={player.id}
                onClick={() => handleDeletePlayerFromThisMatch(player)}>
                {player.displayName}
              </li>
            ))}
          </ul>
        )}

        <legend> Available players:</legend>
        {tournamentAvailablePlayers && (
          <ul>
            {tournamentAvailablePlayers.map((player) => (
              <li
                key={player.id}
                onClick={() => handleAddPlayerToThisMatch(player)}>
                {player.displayName}
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <button type='submit'>Create Match</button>
    </form>
  );
};

export default MatchForm;
