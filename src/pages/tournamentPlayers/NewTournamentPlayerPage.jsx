import { useParams } from 'react-router-dom';

import NewTournamentPlayerSection from '../../components/tournamentPlayers/NewTournamentPlayerSection/NewTournamentPlayerSection';

import { getUserAuthCtx } from '../../context/authContext';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const NewTournamentPlayerPage = () => {
  const { tournamentId } = useParams();
  const { userPlayerProfile, updatedUserTournamentsPlayers } = getUserAuthCtx();

  const nonVerifiedPlayers = updatedUserTournamentsPlayers.filter(
    (player) => !player.isVerified
  );

  const tournamentNonVerifiedPlayers = nonVerifiedPlayers.filter((player) =>
    player.tournaments.all.includes(tournamentId)
  );

  const previousNonVerifiedPlayers = nonVerifiedPlayers.filter(
    (player) => !tournamentNonVerifiedPlayers.includes(player)
  );

  let isLoading = true;
  if (userPlayerProfile && updatedUserTournamentsPlayers.length > 0)
    isLoading = false;

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <NewTournamentPlayerSection
          userPlayerProfile={userPlayerProfile}
          previousNonVerifiedPlayers={previousNonVerifiedPlayers}
        />
      )}
    </>
  );
};

export default NewTournamentPlayerPage;
