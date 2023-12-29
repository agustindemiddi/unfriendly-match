import { useState, useEffect } from 'react';

import SoccerField from './SoccerField';

import { getUserAuthCtx } from '../../../context/authContext';
import {
  subscribeToMatchChanges,
  getTournament,
  getPlayers,
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
  const { user } = getUserAuthCtx();

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

  // add listener to matchDoc:
  useEffect(() => {
    const unsubscribe = subscribeToMatchChanges(
      match.tournament,
      match.id,
      setUpdatedMatch
    );
    return () => unsubscribe();
  }, [match.tournament, match.id]);

  // get tournament image:
  useEffect(() => {
    const fetchTournament = async () => {
      const fetchedTournament = await getTournament(tournamentId);
      setTournamentImage(fetchedTournament.image);
    };
    fetchTournament();
  }, [tournamentId]);

  // get match players:
  useEffect(() => {
    const fetchPlayers = async () => {
      const fetchedPlayers = await getPlayers(players);
      setSubscribedPlayers(fetchedPlayers);
    };
    fetchPlayers();
  }, [players]);

  // get match teams:
  useEffect(() => {
    const fetchTeams = async () => {
      const fetchedTeams = await getMatchTeams(teamA, teamB);
      setTeams(fetchedTeams);
    };
    fetchTeams();
  }, [teamA, teamB]);

  // set countdown to match date time subscription:
  useEffect(() => {
    const intervalId = setInterval(
      () =>
        setMatchSubscriptionCountdown(calculateCountdown(subscriptionDateTime)),
      1000
    );
    return () => clearInterval(intervalId);
  }, [subscriptionDateTime]);

  if (user) {
    const userId = user.uid;

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
        }}
      />
    );
  }
};

export default SoccerFieldContainer;
