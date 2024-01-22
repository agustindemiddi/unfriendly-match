import { useParams } from 'react-router-dom';

import EditTournamentSection from '../../components/tournaments/EditTournamentSection/EditTournamentSection';

import { getUserAuthCtx } from '../../context/authContext';

const EditTournamentPage = () => {
  const { tournamentId } = useParams();
  const { userPlayerProfile, updatedUserTournaments } = getUserAuthCtx();
  const tournament = updatedUserTournaments?.all?.find(
    (tournament) => tournament.id === tournamentId
  );

  return (
    <>
      {userPlayerProfile && tournament && (
        <EditTournamentSection
          userPlayerProfile={userPlayerProfile}
          tournament={tournament}
        />
      )}
    </>
  );
};
export default EditTournamentPage;
