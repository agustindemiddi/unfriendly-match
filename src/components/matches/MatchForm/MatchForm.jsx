import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';

import db from '../../../utils/firebaseConfig';

import { getUserAuthCtx } from '../../../context/AuthContext';

const MatchForm = () => {
  const matchDateInputRef = useRef();
  const matchTimeInputRef = useRef();
  const matchAddressInputRef = useRef();
  const matchRegistryStartDateInputRef = useRef();
  const matchRegistryStartTimeInputRef = useRef();
  const params = useParams();

  const addMatch = async (matchData) => {
    const docRef = await addDoc(
      collection(db, 'tournaments', params.tournamentId, 'matches'),
      matchData
    );

    // console.log('Document written with ID: ', docRef.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const matchDateValue = matchDateInputRef.current.value;
    const matchTimeValue = matchTimeInputRef.current.value;
    const matchCombinedDateTime = `${matchDateValue}T${matchTimeValue}`;
    const matchTimestamp = new Date(matchCombinedDateTime);

    const matchRegistryDateValue = matchRegistryStartDateInputRef.current.value;
    const matchRegistryTimeValue = matchRegistryStartTimeInputRef.current.value;
    const matchRegistryCombinedDateTime = `${matchRegistryDateValue}T${matchRegistryTimeValue}`;
    const matchRegistryTimestamp = new Date(matchRegistryCombinedDateTime);

    const userId = getUserAuthCtx().user.uid;
    const matchData = {
      matchDateTime: matchTimestamp,
      address: matchAddressInputRef.current.value,
      matchRegistryDateTime: matchRegistryTimestamp,
      admins: [userId],
      players: [userId],
      matchCreationDateTime: Date.now(),
    };

    addMatch(matchData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        dia partido
        <input type='date' name='match-date' ref={matchDateInputRef} />
      </label>
      hora partido
      <label>
        <input type='time' name='match-time' ref={matchTimeInputRef} />
      </label>
      <label>
        direccion
        <input
          name='match-address'
          placeholder='match-address'
          ref={matchAddressInputRef}
        />
      </label>
      <label>
        dia comienzo registro
        <input
          type='date'
          name='match-registry-date'
          ref={matchRegistryStartDateInputRef}
        />
      </label>
      hora comienzo registro
      <label>
        <input
          type='time'
          name='match-registry-time'
          ref={matchRegistryStartTimeInputRef}
        />
      </label>
      <button type='submit'>Create Match</button>
    </form>
  );
};

export default MatchForm;
