import { useParams } from 'react-router-dom';

import TournamentDetailSection from '../../components/tournaments/TournamentDetailSection/TournamentDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams();
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedActiveTournamentsMatches,
    updatedUserTournamentsPlayers,
    unsubscribedTournament,
    unsubscribedTournamentPlayers,
    unsubscribedTournamentMatches,
  } = getUserAuthCtx();

  const updatedTournament = updatedUserTournaments.all.find(
    (tournament) => tournament.id === tournamentId
  );

  const updatedTournamentMatches = updatedActiveTournamentsMatches.filter(
    (match) => match.tournament === tournamentId
  );

  const updatedTournamentPlayers = updatedUserTournamentsPlayers.filter(
    (player) => player.tournaments.all.includes(tournamentId)
  );

  let isLoading = true;
  if (
    userPlayerProfile &&
    (updatedTournament || unsubscribedTournament) &&
    (updatedTournamentPlayers.length > 0 ||
      unsubscribedTournamentPlayers.length > 0)
  )
    isLoading = false;

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <TournamentDetailSection
          userPlayerProfile={userPlayerProfile}
          tournament={updatedTournament || unsubscribedTournament}
          matches={
            updatedTournamentMatches.length > 0
              ? updatedTournamentMatches
              : unsubscribedTournamentMatches
          }
          players={
            updatedTournamentPlayers.length > 0
              ? updatedTournamentPlayers
              : unsubscribedTournamentPlayers
          }
        />
      )}
    </>
  );
};

export default TournamentDetailPage;
