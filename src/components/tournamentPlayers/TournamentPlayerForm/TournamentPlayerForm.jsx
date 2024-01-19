import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './TournamentPlayerForm.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import { addNonVerifiedPlayerToTournament } from '../../../utils/firebase/firestore/firestoreActions';

const TournamentPlayerForm = () => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const playerId = uuidv4();

    const displayName = nameInput.current.value;
    const playerData = {
      creationDateTime: new Date(),
      isVerified: false,
      isPublic: false,
      displayName: displayName,
      username: `${displayName}_${playerId}`,
      image: '',
      description: '',
      tournaments: {
        all: [tournamentId],
        active: [tournamentId],
        finished: [],
      },
      createdBy: userPlayerProfile.id,
    };

    await addNonVerifiedPlayerToTournament(tournamentId, playerId, playerData);

    nameInput.current.value = '';

    console.log('player created!');

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

export default TournamentPlayerForm;
