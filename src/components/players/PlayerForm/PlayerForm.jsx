import { useRef, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import db from '../../../utils/firebaseConfig';

const PlayerForm = () => {
  const nameInput = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    nameInput.current.focus();
  }, []);

  const addPlayer = async (playerName) => {
    const docRef = await addDoc(collection(db, 'players'), {
      name: playerName,
    });

    // console.log('Document written with ID: ', docRef.id);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    addPlayer(nameInput.current.value);
    navigate('..', { relative: 'path' });
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
