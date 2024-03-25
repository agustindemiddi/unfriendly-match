import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import EditMatchSection from '../../components/matches/EditMatchSection/EditMatchSection';

import { getUserAuthCtx } from '../../context/authContext';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const EditMatchPage = () => {
  const { tournamentId, matchId } = useParams();
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedTournamentMatches,
    updatedUserTournamentsPlayers,
    updatedTournamentInactivePlayers,
  } = getUserAuthCtx();

  const tournament = updatedUserTournaments.all.find(
    (tournament) => tournament.id === tournamentId
  );

  const updatedTournamentPlayers = updatedUserTournamentsPlayers.filter(
    (player) => player.tournaments.all.includes(tournamentId)
  );

  const allTournamentPlayers = [...updatedTournamentPlayers, ...updatedTournamentInactivePlayers];

  // fallback for finished tournament match? no, admin must re-open tournament and edit match (this way, all tournament players knows). so, no fallback but think of mechanism so admin knows that he/she cannot modify matches of finished tournaments
  const match = updatedTournamentMatches.find((match) => match.id === matchId);

  const matchPlayers = allTournamentPlayers.filter((player) =>
    match?.players.includes(player.id)
  );

  const availablePlayers = allTournamentPlayers.filter(
    (player) => !match?.players.includes(player.id)
  );

  let isLoading = true;
  if (
    userPlayerProfile &&
    tournament &&
    updatedUserTournamentsPlayers.length > 0 &&
    match
  )
    isLoading = false;

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <EditMatchSection
          userPlayerProfile={userPlayerProfile}
          tournament={tournament}
          tournamentPlayers={allTournamentPlayers}
          match={match}
          matchPlayers={matchPlayers}
          availablePlayers={availablePlayers}
        />
      )}
    </>
  );
};

export default EditMatchPage;
