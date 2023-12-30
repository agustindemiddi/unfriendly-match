import { useState, useEffect } from 'react';

import SoccerField from './SoccerField';

import { getUserAuthCtx } from '../../context/authContext';
import {
  addMatchListener,
  getTournament,
  getPlayers,
  getTeams,
  addTournamentListener,
} from '../../utils/firebase/firestore/firestoreActions';
import getMatchStatus from '../../utils/getMatchStatus';
import formatDate from '../../utils/formatDate';
import calculateCountdown from '../../utils/calculateCountdownToMatchSubscription';

const SoccerFieldContainer = ({ match }) => {
  const { user } = getUserAuthCtx();
  const [updatedMatch, setUpdatedMatch] = useState(match);
  const [updatedTournament, setUpdatedTournament] = useState({});
  const [subscribedPlayers, setSubscribedPlayers] = useState([]);
  const [teams, setTeams] = useState({ teamA: [], teamB: [] });
  const [matchSubscriptionCountdown, setMatchSubscriptionCountdown] =
    useState('');

  const { uid: userId } = user;

  const isTournamentPlayer = updatedTournament?.players?.includes(userId);

  const {
    id: matchId,
    tournament: tournamentId,
    creator,
    admins,
    creationDateTime,
    subscriptionDateTime,
    dateTime,
    address,
    playerQuota,
    players,
    teamA,
    teamB,
    result,
    mvps,
  } = updatedMatch;

  const { image: tournamentImage } = updatedTournament;

  useEffect(() => {
    // add listener to matchDoc:
    const unsubscribe = addMatchListener(
      match.tournament,
      match.id,
      setUpdatedMatch
    );
    return () => unsubscribe();
  }, [match.tournament, match.id]);

  useEffect(() => {
    // add listener to tournamentDoc:
    const unsubscribe = addTournamentListener(
      match.tournament,
      setUpdatedTournament
    );
    return () => unsubscribe();
  }, [match.tournament]);

  useEffect(() => {
    // get match players:
    const fetchPlayers = async () => {
      const fetchedPlayers = await getPlayers(players);
      setSubscribedPlayers(fetchedPlayers);
    };
    fetchPlayers();
  }, [players]);

  useEffect(() => {
    // get match teams:
    const fetchTeams = async () => {
      const fetchedTeams = await getTeams(teamA, teamB);
      setTeams(fetchedTeams);
    };
    fetchTeams();
  }, [teamA, teamB]);

  useEffect(() => {
    // set countdown to match date time subscription:
    const intervalId = setInterval(
      () =>
        setMatchSubscriptionCountdown(calculateCountdown(subscriptionDateTime)),
      1000
    );
    return () => clearInterval(intervalId);
  }, [subscriptionDateTime]);

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
        isTournamentPlayer,
      }}
    />
  );
};

export default SoccerFieldContainer;
