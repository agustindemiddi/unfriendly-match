import Section from '../../UI/Section/Section';

import styles from './AdminSection.module.css';

import {
  mergePlayers,
  declineMergeRequest,
  approveJoinTournamentRequest,
  declineJoinTournamentRequest,
} from '../../../utils/firebase/firestore/firestoreActions';
import { getStringFormattedLongDateTime } from '../../../utils/getDates';
import { getStringFormattedShortDate } from '../../../utils/getDates';

const AdminSection = ({
  userPlayerProfile,
  mergeRequestedPlayers,
  tournamentsWithJoinRequests,
}) => {
  const handleApproveMerge = async (verifiedUser, nonVerifiedUser) => {
    const matchesWithConflict = await mergePlayers(
      verifiedUser,
      nonVerifiedUser,
      userPlayerProfile.id
    );
    if (matchesWithConflict) {
      matchesWithConflict.sort((a, b) => a.dateTime - b.dateTime);
      const matchesWithConflictDateTimes = Array.from(
        new Set(
          matchesWithConflict?.map((match) =>
            getStringFormattedShortDate(match.dateTime)
          )
        )
      );
      alert(
        `Conflict found, merge prevented: both players participate in the same match in at least one case. Please check matches played on ${matchesWithConflictDateTimes
          .join(', ')
          .toLocaleString()}`
      );
    } else {
      alert('Merge successful!');
    }
  };

  const handleApproveJoinTournamentRequest = async (
    tournament,
    requestingPlayer
  ) => {
    await approveJoinTournamentRequest(tournament, requestingPlayer);
  };

  return (
    <Section>
      {mergeRequestedPlayers?.length > 0 && (
        <div>
          <h2>Player Profile Merge Requests</h2>
          <ul>
            {mergeRequestedPlayers.map((player) => (
              <li key={player.id}>
                <h3>{player.displayName}</h3>
                <ul>
                  {player.mergeRequests?.map((mergeRequest) => (
                    <li key={mergeRequest.requestedBy.id}>
                      <span>
                        Requested on{' '}
                        {getStringFormattedLongDateTime(
                          mergeRequest.requestDateTime
                        )}
                      </span>
                      <img
                        src={mergeRequest.requestedBy.image}
                        alt=''
                        style={{ width: '40px' }}
                      />
                      <span>{`${mergeRequest.requestedBy.displayName} >`}</span>
                      <img
                        src={player.image}
                        alt=''
                        style={{ width: '40px' }}
                      />
                      <button
                        onClick={() =>
                          handleApproveMerge(mergeRequest.requestedBy, player)
                        }>
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          declineMergeRequest(mergeRequest.requestedBy, player)
                        }>
                        Decline
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tournamentsWithJoinRequests?.length > 0 && (
        <div>
          <h2>Join Tournament Requests</h2>
          <ul>
            {tournamentsWithJoinRequests.map((tournament) => (
              <li key={tournament.id}>
                <h3>{tournament.name}</h3>
                <ul>
                  {tournament.joinRequests.map((joinRequest) => (
                    <li key={joinRequest.requestedBy.id}>
                      <span>
                        Requested on{' '}
                        {getStringFormattedLongDateTime(
                          joinRequest.requestDateTime
                        )}
                      </span>
                      <img
                        src={joinRequest.requestedBy.image}
                        alt=''
                        style={{ width: '40px' }}
                      />
                      <span>{`${joinRequest.requestedBy.displayName} >`}</span>
                      <button
                        onClick={() =>
                          handleApproveJoinTournamentRequest(
                            tournament,
                            joinRequest.requestedBy
                          )
                        }>
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          declineJoinTournamentRequest(
                            joinRequest.requestedBy,
                            tournament
                          )
                        }>
                        Decline
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
};

export default AdminSection;
