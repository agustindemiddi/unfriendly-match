import { useState, useEffect } from 'react';

import SoccerField from './SoccerField';

import { getUserAuthCtx } from '../../../context/AuthContext';

import {
  subscribeToMatchChanges,
  getTournament,
  getMatchPlayers,
  getMatchTeams,
} from '../../../utils/firebase/firestore/firestoreActions';
import getMatchStatus from '../../../utils/getMatchStatus';
import formatDate from '../../../utils/formatDate';
import calculateCountdown from '../../../utils/calculateCountdownToMatchSubscription';

const SoccerFieldContainer = ({ match }) => {
  const [updatedMatch, setUpdatedMatch] = useState(match);
  const [tournamentImage, setTournamentImage] = useState('');
  const [subscribedPlayers, setSubscribedPlayers] = useState([]);
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
    registryDateTime: subscriptionDateTime,
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
    isSubscriptionStarted,
    isSubscriptionEnded,
    remainingPlayersQuota,
    isSubscriptionOpen,
    mvpsString,
    isUserSubscribed,
  } = getMatchStatus({
    result,
    subscriptionDateTime,
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
      setUpdatedMatch
    );
    return () => unsubscribe();
  }, [tournamentId, matchId]);

  // get tournament image:
  useEffect(() => {
    if (tournamentId) {
      const fetchTournament = async () => {
        const tournament = await getTournament(tournamentId);
        setTournamentImage(tournament.image);
      };
      fetchTournament();
    }
  }, [tournamentId]);

  // get match players:
  useEffect(() => {
    if (players && players.length > 0) {
      const fetchPlayers = async () => {
        const subscribedPlayers = await getMatchPlayers(players);
        setSubscribedPlayers(subscribedPlayers);
      };
      fetchPlayers();
    }
  }, [players]);

  // get match teams:
  useEffect(() => {
    const fetchTeams = async () => {
      const updatedTeams = await getMatchTeams(teamA, teamB);
      setTeams(updatedTeams);
    };
    fetchTeams();
  }, [teamA, teamB]);

  // set countdown to match date time subscription:
  useEffect(() => {
    const intervalId = setInterval(
      () => setMatchSubscriptionCountdown(calculateCountdown(subscriptionDateTime)),
      1000
    );
    return () => clearInterval(intervalId);
  }, [subscriptionDateTime]);

  const formattedSubscriptionDateTime = formatDate(subscriptionDateTime);
  const formattedDateTime = formatDate(dateTime);

  return (
    <SoccerField
      matchProps={{
        tournamentId,
        // creator,
        // admins,
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
        subscribedPlayers,
        teams,
        formattedSubscriptionDateTime,
        formattedDateTime,
        matchSubscriptionCountdown,
        isUserSubscribed,
        matchId,
      }}
    />
  );
};

export default SoccerFieldContainer;
