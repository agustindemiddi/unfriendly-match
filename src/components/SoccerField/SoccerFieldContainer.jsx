import { useState, useEffect } from 'react';

import SoccerField from './SoccerField';

import { addMultipleMatchPlayersListener } from '../../utils/firebase/firestore/firestoreActions';
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

  const isTournamentPlayer = tournament?.players?.includes(userId);

  const formattedDateTime = getStringFormattedLongDateTime(dateTime);
  const formattedSubscriptionDateTime =
    getStringFormattedLongDateTime(subscriptionDateTime);

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
        formattedDateTime,
        formattedSubscriptionDateTime,
        matchSubscriptionCountdown,
        isUserSubscribed,
        matchId,
        isTournamentPlayer,
      }}
    />
  );
};

export default SoccerFieldContainer;
