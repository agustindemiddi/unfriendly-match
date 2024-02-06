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
  } = getUserAuthCtx();

  const tournament = updatedUserTournaments.all.find(
    (tournament) => tournament.id === tournamentId
  );

  const tournamentMatches = updatedActiveTournamentsMatches.filter(
    (match) => match.tournament === tournamentId
  );

  let isLoading = true;
  if (
    userPlayerProfile &&
    (tournament || unsubscribedTournament) &&
    (updatedUserTournamentsPlayers.length > 0 ||
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
          tournament={tournament || unsubscribedTournament}
          matches={tournamentMatches}
          players={
            updatedUserTournamentsPlayers || unsubscribedTournamentPlayers
          }
        />
      )}
    </>
  );
};

export default TournamentDetailPage;
