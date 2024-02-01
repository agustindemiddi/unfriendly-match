import { useState, useEffect } from 'react';
import AdminSection from '../components/admin/AdminSection/AdminSection';

import { getUserAuthCtx } from '../context/authContext';
import { getPlayer } from '../utils/firebase/firestore/firestoreActions';

const AdminPage = () => {
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedUserTournamentsPlayers,
  } = getUserAuthCtx();
  const [tournamentsWithJoinRequests, setTournamentsWithJoinRequests] =
    useState([]);

  useEffect(() => {
    if (
      updatedUserTournaments?.active?.filter(
        (tournament) => tournament.joinRequests?.length > 0
      )
    ) {
      const joinRequestedTournaments = updatedUserTournaments?.active?.filter(
        (tournament) => tournament.joinRequests?.length > 0
      );
      const getConvertedTournamentsWithJoinRequests = async () => {
        const convertedTournamentsWithJoinRequests = await Promise.all(
          joinRequestedTournaments?.map(async (tournamentWithJoinRequests) => {
            const updatedJoinRequests = await Promise.all(
              tournamentWithJoinRequests.joinRequests.map(
                async (joinRequest) => {
                  const requestingPlayer = await getPlayer(
                    joinRequest.requestedBy
                  );
                  return {
                    ...joinRequest,
                    requestedBy: requestingPlayer,
                  };
                }
              )
            );
            updatedJoinRequests.sort(
              (a, b) => a.requestDateTime - b.requestDateTime
            );
            return {
              ...tournamentWithJoinRequests,
              joinRequests: updatedJoinRequests,
            };
          })
        );
        setTournamentsWithJoinRequests(convertedTournamentsWithJoinRequests);
      };
      getConvertedTournamentsWithJoinRequests();
    } else {
      setTournamentsWithJoinRequests([]);
    }
  }, [updatedUserTournaments?.active]);

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
        (a, b) => a.requestDateTime - b.requestDateTime // shouldn't it be already sorted?
      );
      return {
        ...mergeRequestedPlayer,
        mergeRequests: updatedMergeRequests,
      };
    }
  );

  return (
    <>
      {userPlayerProfile &&
        convertedMergeRequestedPlayers &&
        tournamentsWithJoinRequests && ( // mejorar esto
          <AdminSection
            userPlayerProfile={userPlayerProfile}
            mergeRequestedPlayers={convertedMergeRequestedPlayers}
            tournamentsWithJoinRequests={tournamentsWithJoinRequests}
          />
        )}
    </>
  );
};

export default AdminPage;
