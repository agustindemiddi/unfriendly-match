import Section from '../../UI/Section/Section';

import styles from './AdminSection.module.css';

import { mergePlayers } from '../../../utils/firebase/firestore/firestoreActions';
import { getStringFormattedLongDateTime } from '../../../utils/getDates';

const AdminSection = ({ userPlayerProfile, mergeRequestedPlayers }) => {
  const approveMergeHandler = (verifiedPlayer, nonVerifiedPlayer) => {
    mergePlayers(verifiedPlayer, nonVerifiedPlayer, userPlayerProfile.id);
  };

  const declineMergeHandler = () => {};

  console.log(mergeRequestedPlayers);

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
                      <button onClick={()=>approveMergeHandler(mergeRequest.requestedBy, player)}>Approve</button>
                      <button>Decline</button>
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
