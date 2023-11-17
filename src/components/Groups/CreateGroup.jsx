import { useRef, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import db from '../../utils/firebaseConfig';

const CreateGroup = () => {
  const nameInput = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    nameInput.current.focus();
  }, []);

  const addGroup = async (groupName) => {
    const docRef = await addDoc(collection(db, 'groups'), {
      name: groupName,
    });

    // console.log('Document written with ID: ', docRef.id);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    addGroup(nameInput.current.value);
    navigate('..', { relative: 'path' });
  };

  return (
    <>
      <h2>Create Group Basic Form</h2>
      <form onSubmit={submitHandler}>
        <label>
          Group Name:
          <input type='text' ref={nameInput} required />
        </label>
        <button type='submit'>Create Group</button>
      </form>
    </>
  );
};

export default CreateGroup;
