import { useState, useEffect } from 'react';

import SoccerField from './SoccerField';

import { getUserAuthCtx } from '../../../context/AuthContext';

import {
  subscribeToMatchChanges,
  getTournamentImage,
  getMatchTeams,
  getMatchPlayers,
} from '../../../utils/firebase/firestore/firestoreActions';
import getMatchStatus from '../../../utils/getMatchStatus';
import formatDate from '../../../utils/formatDate';

import calculateCountdown from '../../../utils/calculateCountdownToMatchSubscription';

const SoccerFieldContainer = ({ match }) => {
  const [updatedMatch, setUpdatedMatch] = useState(match);
  const [tournamentImage, setTournamentImage] = useState('');
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [teams, setTeams] = useState({ teamA: [], teamB: [] });
  const [matchSubscriptionCountdown, setMatchSubscriptionCountdown] =
    useState('');

  const {
    userPlayerProfile: { id: userId },
  } = getUserAuthCtx();

  const {
    id: matchId,
    tournament: tournamentId,
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
    mvps,
  } = updatedMatch;

  const {
    isRegistryStarted,
    isRegistryEnded,
    remainingPlayersQuota,
    isRegistryOpen,
    mvpsString,
    isUserSubscribed,
  } = getMatchStatus({
    result,
    registryDateTime,
    dateTime,
    playerQuota,
    players,
    teams,
    mvps,
    userId,
  });

  // add listener to matchDoc:
  useEffect(() => {
    const unsubscribe = subscribeToMatchChanges(
      tournamentId,
      matchId,
      // players,
      setUpdatedMatch
    );
    return () => unsubscribe();
  }, [tournamentId, matchId]);

  // get tournament image:
  useEffect(() => {
    if (tournamentId) getTournamentImage(tournamentId, setTournamentImage);
  }, [tournamentId]);

  // get match players:
  useEffect(() => {
    if (players && players.length > 0)
      getMatchPlayers(players, setRegisteredPlayers);
  }, [players]);

  // get match teams:
  useEffect(() => {
    getMatchTeams(teamA, teamB, setTeams);
  }, [teamA, teamB]);

  const formattedRegistryDateTime = formatDate(registryDateTime);
  const formattedDateTime = formatDate(dateTime);

  // set countdown to match date time subscription:
  useEffect(() => {
    const intervalId = setInterval(
      () => setMatchSubscriptionCountdown(calculateCountdown(registryDateTime)),
      1000
    );
    return () => clearInterval(intervalId);
  }, [registryDateTime]);

  return (
    <SoccerField
      matchProps={{
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
      }}
    />
  );
};

export default SoccerFieldContainer;
