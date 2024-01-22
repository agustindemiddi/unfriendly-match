import { useState, useEffect } from 'react';

import SoccerField from './SoccerField';

import { getUserAuthCtx } from '../../context/authContext';
import {
  getMatchPlayers,
  addMultipleMatchPlayersListener,
  getTeams,
} from '../../utils/firebase/firestore/firestoreActions';
import getMatchStatus from '../../utils/getMatchStatus';
import formatDate from '../../utils/formatDate';
import calculateCountdown from '../../utils/calculateCountdownToMatchSubscription';

const SoccerFieldContainer = ({ userPlayerProfile, match }) => {
  const { user, updatedUserTournaments } = getUserAuthCtx();
  const [updatedMatchPlayers, setUpdatedMatchPlayers] = useState([]);
  const [teams, setTeams] = useState({ teamA: [], teamB: [] });
  const [matchSubscriptionCountdown, setMatchSubscriptionCountdown] =
    useState('');

  const { uid: userId } = user;
  // const userId = userPlayerProfile.id;

  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === match.tournament
  )[[0]];

  const tournamentImage = tournament?.image;

  const isTournamentPlayer = tournament?.players?.includes(userId);

  const sortedUpdatedMatchPlayers = [...updatedMatchPlayers].sort(
    (a, b) => a.matchSubscriptionDateTime - b.matchSubscriptionDateTime
  );

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
    teamA,
    teamB,
    result,
    mvps,
  } = match;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Fetch match players:
        const fetchedPlayers = await getMatchPlayers(tournamentId, matchId);

        // add listener to matchPlayersDocs:
        if (fetchedPlayers.length > 0) {
          const matchPlayersIdsArray = fetchedPlayers.map(
            (player) => player.id
          );
          const unsubscribe = addMultipleMatchPlayersListener(
            tournamentId,
            matchId,
            matchPlayersIdsArray,
            setUpdatedMatchPlayers
          );
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching match players:', error);
      }
    };
    fetchPlayers();
  }, [tournamentId, matchId]);

  useEffect(() => {
    // get match teams:
    if (Object.keys(result).length > 0) {
      const fetchTeams = async () => {
        const fetchedTeams = await getTeams(teamA, teamB);
        setTeams(fetchedTeams);
      };
      fetchTeams();
    }
  }, [result, teamA, teamB]);

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
    sortedUpdatedMatchPlayers,
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
        sortedUpdatedMatchPlayers,
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
