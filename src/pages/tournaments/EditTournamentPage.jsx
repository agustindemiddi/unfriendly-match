import { useParams } from 'react-router-dom';

import EditTournamentSection from '../../components/tournaments/EditTournamentSection/EditTournamentSection';

import { getUserAuthCtx } from '../../context/authContext';

const EditTournamentPage = () => {
  const { tournamentId } = useParams();
  const { updatedUserTournaments } = getUserAuthCtx();
  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];

  return <EditTournamentSection tournament={tournament} />;
};
export default EditTournamentPage;
