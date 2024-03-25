import TournamentsSection from '../../components/tournaments/TournamentsSection/TournamentsSection';

import { getUserAuthCtx } from '../../context/authContext';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const TournamentsPage = () => {
  const { updatedUserTournaments } = getUserAuthCtx();

  // return (
  //   <>
  //     {updatedUserTournaments.all.length > 0 ? (
  //       <TournamentsSection tournaments={updatedUserTournaments} />
  //     ) : (
  //       <LoadingBouncingSoccerBall />
  //     )}
  //   </>
  // );

  return (
    <>
      <TournamentsSection tournaments={updatedUserTournaments} />
    </>
  );
};

export default TournamentsPage;
