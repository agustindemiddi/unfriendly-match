import NewTournamentSection from '../../components/tournaments/NewTournamentSection/NewTournamentSection';

import { getUserAuthCtx } from '../../context/authContext';

const NewTournamentPage = () => {
  const { userPlayerProfile } = getUserAuthCtx();

  return (
    <>
      {userPlayerProfile && (
        <NewTournamentSection userPlayerProfile={userPlayerProfile} />
      )}
    </>
  );
};

export default NewTournamentPage;
