import { useRef, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import db from '../../../utils/firebaseConfig';

const TournamentForm = () => {
  const nameInput = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    nameInput.current.focus();
  }, []);

  const addTournament = async (tournamentName) => {
    const docRef = await addDoc(collection(db, 'tournaments'), {
      name: tournamentName,
    });

    // console.log('Document written with ID: ', docRef.id);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    addTournament(nameInput.current.value);
    navigate('..', { relative: 'path' });
  };

  return (
    <form onSubmit={submitHandler}>
      <label>
        Tournament Name:
        <input type='text' ref={nameInput} required />
      </label>
      <button type='submit'>Create Tournament</button>
    </form>
  );
};

export default TournamentForm;
