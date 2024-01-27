import { useParams } from 'react-router-dom';

import styles from './PreviousNonVerifiedPlayersList.module.css';

import { subscribeToTournament } from '../../../utils/firebase/firestore/firestoreActions';

const PreviousNonVerifiedPlayersList = ({ previousNonVerifiedPlayers }) => {
  const { tournamentId } = useParams();

  return (
    <ul>
      {previousNonVerifiedPlayers.map((player) => (
        <li key={player.id}>
          {player.displayName}
          <button
            onClick={() => subscribeToTournament(tournamentId, player.id)}>
            add to this tournament
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PreviousNonVerifiedPlayersList;
