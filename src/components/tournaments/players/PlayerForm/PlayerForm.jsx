import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './PlayerForm.module.css';

import { addNonVerifiedPlayerToTournament } from '../../../../utils/firebase/firestore/firestoreActions';

const PlayerForm = () => {
  const nameInput = useRef();
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    nameInput.current.focus();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    const playerData = {
      id: uuidv4(),
      displayName: nameInput.current.value,
      creationDateTime: new Date(),
    };

    addNonVerifiedPlayerToTournament(tournamentId, playerData);

    alert(
      'You have successfully added a non-verified player to this tournament!'
    );

    navigate(`/tournaments/${tournamentId}/players`);
  };

  return (
    <form onSubmit={submitHandler}>
      <label>
        Player Name:
        <input type='text' ref={nameInput} required />
      </label>
      <button type='submit'>Create Player</button>
    </form>
  );
};

export default PlayerForm;
