import NewTournamentSection from '../../components/tournaments/NewTournamentSection/NewTournamentSection';

import { getUserAuthCtx } from '../../context/authContext';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const NewTournamentPage = () => {
  const { userPlayerProfile } = getUserAuthCtx();

  return (
    <>
      {userPlayerProfile ? (
        <NewTournamentSection userPlayerProfile={userPlayerProfile} />
      ) : (
        <LoadingBouncingSoccerBall />
      )}
    </>
  );
};

export default NewTournamentPage;
