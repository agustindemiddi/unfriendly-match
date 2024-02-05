import { useParams } from 'react-router-dom';

import NewMatchSection from '../../components/matches/NewMatchSection/NewMatchSection';

import { getUserAuthCtx } from '../../context/authContext';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const NewMatchPage = () => {
  const { tournamentId } = useParams();
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedUserTournamentsPlayers,
  } = getUserAuthCtx();

  const tournament = updatedUserTournaments.all.find(
    (tournament) => tournament.id === tournamentId
  );

  const updatedTournamentPlayers = updatedUserTournamentsPlayers.filter(
    (player) => player.tournaments.all.includes(tournamentId)
  );

  // exclude user from available players:
  const availablePlayers = updatedUserTournamentsPlayers.filter(
    (player) => player.id !== userPlayerProfile.id
  );

  let isLoading = true;
  if (userPlayerProfile && tournament && updatedTournamentPlayers.length > 0)
    isLoading = false;

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <NewMatchSection
          userPlayerProfile={userPlayerProfile}
          tournament={tournament}
          tournamentPlayers={updatedTournamentPlayers}
          availablePlayers={availablePlayers}
        />
      )}
    </>
  );
};

export default NewMatchPage;
