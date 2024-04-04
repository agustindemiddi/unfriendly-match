import { useState, useEffect } from 'react';

import SoccerField from './SoccerField';

import {
  addMultipleMatchPlayersListener,
  deleteMatch,
} from '../../utils/firebase/firestore/firestoreActions';
import getMatchStatus from '../../utils/getMatchStatus';
import { getStringFormattedLongDateTime } from '../../utils/getDates';
import calculateCountdown from '../../utils/calculateCountdownToMatchSubscription';

const SoccerFieldContainer = ({ userPlayerProfile, tournament, match }) => {
  const [updatedMatchPlayers, setUpdatedMatchPlayers] = useState([]);
  const [matchSubscriptionCountdown, setMatchSubscriptionCountdown] =
    useState('');

  const {
    id: matchId,
    tournament: tournamentId,
    creator: matchCreator,
    admins: matchAdmins,
    // creationDateTime,
    subscriptionDateTime,
    dateTime,
    address,
    playerQuota,
    players,
    teamA,
    teamB,
    result,
    mvps,
  } = match;

  // add listener to matchPlayersDocs:
  useEffect(() => {
    if (players.length > 0) {
      const unsubscribe = addMultipleMatchPlayersListener(
        tournamentId,
        matchId,
        players,
        setUpdatedMatchPlayers
      );
      return () => unsubscribe();
    } else {
      setUpdatedMatchPlayers([]);
    }
  }, [tournamentId, matchId, players]);

  // set countdown to match date time subscription:
  useEffect(() => {
    const intervalId = setInterval(
      () =>
        setMatchSubscriptionCountdown(calculateCountdown(subscriptionDateTime)),
      1000
    );
    return () => clearInterval(intervalId);
  }, [subscriptionDateTime]);

  const userId = userPlayerProfile?.id;

  const sortedUpdatedMatchPlayers = [...updatedMatchPlayers].sort(
    (a, b) => a.matchSubscriptionDateTime - b.matchSubscriptionDateTime
  );

  const updatedTeamA = updatedMatchPlayers.filter((matchPlayer) =>
    teamA.includes(matchPlayer.id)
  );
  const updatedTeamB = updatedMatchPlayers.filter((matchPlayer) =>
    teamB.includes(matchPlayer.id)
  );
  const teams = { teamA: updatedTeamA, teamB: updatedTeamB };

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

  const tournamentImage = tournament?.image;

  const isUserTournamentPlayer = tournament?.players?.active.includes(userId);
  const isUserTournamentCreator = tournament.creator === userId;
  const isUserTournamentAdmin = tournament.admins.includes(userId);
  const isUserMatchCreator = matchCreator === userId;
  const isUserMatchAdmin = matchAdmins.includes(userId);

  const tournamentCreator = tournament.creator;
  const tournamentAdmins = tournament.admins;

  const formattedDateTime = getStringFormattedLongDateTime(dateTime);
  const formattedSubscriptionDateTime =
    getStringFormattedLongDateTime(subscriptionDateTime);

  const handleDeleteMatch = () => {
    deleteMatch(tournamentId, matchId);
  };

  return (
    <SoccerField
      matchProps={{
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
        formattedDateTime,
        formattedSubscriptionDateTime,
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
      }}
    />
  );
};

export default SoccerFieldContainer;
