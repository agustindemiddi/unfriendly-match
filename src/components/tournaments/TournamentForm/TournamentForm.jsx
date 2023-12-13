import { useRef, useEffect, useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import styles from './TournamentForm.module.css';

import db from '../../../utils/firebase/firebaseConfig';
import { getUserAuthCtx } from '../../../context/AuthContext';

import trophy01 from '/trophies/trophy01.jpg';
import trophy02 from '/trophies/trophy02.jpg';
import trophy03 from '/trophies/trophy03.jpg';

const TournamentForm = () => {
  const nameInput = useRef();
  const descriptionInput = useRef();
  const defaultPlayerQuotaInput = useRef();
  const defaultAddress = useRef();
  const endDateInputRef = useRef();
  const pointsPerGameWon = useRef();
  const isMvpAllowed = useRef();
  const isPublic = useRef();
  const navigate = useNavigate();
  const [selectedTournamentImage, setSelectedTournamentImage] = useState(
    '/public/trophies/trophy01.jpg'
  );
  const { userPlayerProfile } = getUserAuthCtx();

  const handleImageChange = (event) => {
    setSelectedTournamentImage(event.target.value);
  };

  // useEffect(() => {
  //   nameInput.current.focus();
  // }, []);

  const addTournament = async (tournamentData) => {
    const docRef = await addDoc(collection(db, 'tournaments'), tournamentData);

    // console.log('Document written with ID: ', docRef.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const tournamentEndDate = endDateInputRef.current.value;
    const tournamentEndTime = '23:59:59';
    const tournamentCombinedEndDateTime = `${tournamentEndDate}T${tournamentEndTime}`;
    const endDate = Timestamp.fromDate(new Date(tournamentCombinedEndDateTime));

    const tournamentData = {
      // agregar InputRef a los ref hooks [naming]
      isActive: true,
      creationDateTime: Timestamp.now(),
      terminationDate: endDate, // terminationDate is probably a better naming
      creator: userPlayerProfile.id,
      admins: [userPlayerProfile.id],
      name: nameInput.current.value,
      image: selectedTournamentImage,
      description: descriptionInput.current.value,
      defaultAddress: defaultAddress.current.value,
      defaultPlayerQuota: defaultPlayerQuotaInput.current.value * 2,
      pointsPerGameWon: pointsPerGameWon.current.value,
      isMvpAllowed: isMvpAllowed.current.checked,
      isPublic: isPublic.current.checked,
      players: [userPlayerProfile.id],
    };

    addTournament(tournamentData);
    // navigate('..', { relative: 'path' });
    console.log('tournament created!');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Nombre del torneo:
        <input type='text' ref={nameInput} required />
      </label>

      <label>
        Selecciona una imagen para el torneo:
        <select name='tournamentImage' onChange={handleImageChange}>
          <option value={trophy01}>La Copa</option>
          <option value={trophy02}>Copa Estrella</option>
          <option value={trophy03}>Copa Mundo</option>
        </select>
      </label>
      {selectedTournamentImage && (
        <img
          src={selectedTournamentImage}
          className={styles.selectedTournamentImage}
        />
      )}

      <label>
        Descripción:
        <textarea type='text' ref={descriptionInput} />
      </label>
      <label>
        Cantidad predeterminada de jugadores por equipo:
        <input
          type='number'
          ref={defaultPlayerQuotaInput}
          min={1}
          max={11}
          defaultValue={5}
          required
        />
      </label>
      <label>
        Domicilio predeterminado:
        <input type='text' ref={defaultAddress} />
      </label>
      <label>
        Fecha aproximada de finalización:
        <input type='date' ref={endDateInputRef} required />
      </label>
      <label>
        Puntos obtenidos por partido ganado:
        <input
          type='number'
          defaultValue={3}
          min={2}
          max={3}
          ref={pointsPerGameWon}
          required
        />
        (No se puede modificar)
      </label>
      <label>
        <input type='checkbox' ref={isMvpAllowed} defaultChecked={false} />
        Permitir votar al mejor jugador después de cada partido
      </label>
      <label>
        <input type='checkbox' ref={isPublic} defaultChecked={false} />
        Éste es un torneo público
      </label>
      <button type='submit'>Create Tournament</button>
    </form>
  );
};

export default TournamentForm;
