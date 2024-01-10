import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './PlayerForm.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import { addNonVerifiedPlayerToTournament } from '../../../utils/firebase/firestore/firestoreActions';

const PlayerForm = () => {
  const { tournamentId } = useParams();
  const { userPlayerProfile, updatedUserTournaments } = getUserAuthCtx();
  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];
  const nameInput = useRef();
  // const navigate = useNavigate();

  useEffect(() => {
    nameInput.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const playerData = {
      id: uuidv4(),
      creationDateTime: new Date(),
      createdBy: userPlayerProfile.id,
      displayName: nameInput.current.value,
    };

    addNonVerifiedPlayerToTournament(tournamentId, playerData);

    nameInput.current.value = '';

    // navigate(`/tournaments/${tournamentId}/players`);
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Player name' ref={nameInput} required />
        <button type='submit'>Add</button>
      </form>
      {tournament?.nonVerifiedPlayers?.length > 0 && (
        <div>
          <h2>Added players:</h2>
          <ul>
            {tournament.nonVerifiedPlayers.map((player) => (
              <li key={player.id}>{player.displayName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlayerForm;
