import AdminSection from '../components/admin/AdminSection/AdminSection';

import { getUserAuthCtx } from '../context/authContext';

const AdminPage = () => {
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedUserTournamentsPlayers,
  } = getUserAuthCtx();

  const mergeRequestedPlayers = updatedUserTournamentsPlayers?.filter(
    (player) => player.mergeRequests?.length > 0
  );

  const convertedMergeRequestedPlayers = mergeRequestedPlayers?.map(
    (mergeRequestedPlayer) => {
      const updatedMergeRequests = mergeRequestedPlayer.mergeRequests?.map(
        (mergeRequest) => {
          const requestingPlayer = updatedUserTournamentsPlayers.find(
            (player) => player.id === mergeRequest.requestedBy
          );
          return {
            ...mergeRequest,
            requestedBy: requestingPlayer,
          };
        }
      );
      updatedMergeRequests.sort(
        (a, b) => a.requestDateTime - b.requestDateTime
      );
      return {
        ...mergeRequestedPlayer,
        mergeRequests: updatedMergeRequests,
      };
    }
  );

  return (
    <>
      {userPlayerProfile && convertedMergeRequestedPlayers && (
        <AdminSection
          userPlayerProfile={userPlayerProfile}
          mergeRequestedPlayers={convertedMergeRequestedPlayers}
        />
      )}
    </>
  );
};

export default AdminPage;
