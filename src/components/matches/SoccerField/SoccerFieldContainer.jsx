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

// import calculateCountdown from '../../../utils/calculateCountdownToMatch';

const SoccerFieldContainer = ({ match }) => {
  const [updatedMatch, setUpdatedMatch] = useState(match);
  const [tournamentImage, setTournamentImage] = useState('');
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [teams, setTeams] = useState({ teamA: [], teamB: [] });
  const [matchRegistryCountdown, setMatchRegistryCountdown] = useState('');
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

  // add listener to matchDoc for players property changes:
  useEffect(() => {
    const unsubscribe = subscribeToMatchChanges(
      tournamentId,
      matchId,
      players,
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

  // // set countdown to match registry date time >>>
  // useEffect(() => {
  //   const calculateCountdown = () => {
  //     const currentDateTime = new Date();
  //     const timeDifference = registryDateTime - currentDateTime;

  //     if (timeDifference > 0) {
  //       const seconds = Math.floor((timeDifference / 1000) % 60);
  //       const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
  //       const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  //       const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  //       setMatchRegistryCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  //     } else {
  //       setMatchRegistryCountdown('Match registry already started');
  //     }
  //   };

  //   // calculateCountdown(registryDateTime, setMatchRegistryCountdown);

  //   const intervalId = setInterval(calculateCountdown, 1000);

  //   return () => clearInterval(intervalId);
  // }, [registryDateTime]);
  // // set countdown to match registry date time <<<

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
        matchRegistryCountdown,
        isUserSubscribed,
        matchId,
      }}
    />
  );
};

export default SoccerFieldContainer;
