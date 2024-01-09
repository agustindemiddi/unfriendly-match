import TournamentsSection from '../../components/tournaments/TournamentsSection/TournamentsSection';

import { getUserAuthCtx } from '../../context/authContext';

const TournamentsPage = () => {
  const { updatedUserTournaments } = getUserAuthCtx();

  return (
    <>
      {updatedUserTournaments && (
        <TournamentsSection tournaments={updatedUserTournaments} />
      )}
    </>
  );
};

export default TournamentsPage;
