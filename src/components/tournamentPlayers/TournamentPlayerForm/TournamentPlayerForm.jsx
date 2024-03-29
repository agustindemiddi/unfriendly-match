import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './TournamentPlayerForm.module.css';

import {
  addNonVerifiedPlayerToTournament,
  editPlayer,
} from '../../../utils/firebase/firestore/firestoreActions';

const TournamentPlayerForm = ({ userPlayerProfile, player }) => {
  const { tournamentId } = useParams();
  const nameInput = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    nameInput.current.focus();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const playerId = player?.id || uuidv4();

    const displayName = nameInput.current.value;
    const playerData = {
      creationDateTime: player?.creationDateTime || new Date(),
      isVerified: false,
      isPublic: false,
      displayName: displayName,
      username: `${displayName}_${playerId}`,
      image: '',
      description: '',
      tournaments: {
        all: player?.tournaments.all || [tournamentId],
        active: player?.tournaments.active || [tournamentId],
        finished: player?.tournaments.finished || [],
      },
      createdBy: player?.createdBy || userPlayerProfile.id,
    };

    if (player) {
      await editPlayer(playerId, playerData);
      alert(`You have successfully edited ${displayName}'s name`);
    } else {
      await addNonVerifiedPlayerToTournament(
        tournamentId,
        playerId,
        playerData
      );
      alert(`You have successfully created the player ${displayName}`);
    }

    // nameInput.current.value = '';

    navigate(`/tournaments/${tournamentId}/players`);
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Player name'
          ref={nameInput}
          defaultValue={player?.displayName}
          required
        />
        <button type='submit'>{player ? 'Confirm edit' : 'Add player'}</button>
      </form>
    </div>
  );
};

export default TournamentPlayerForm;
