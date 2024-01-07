import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './TournamentForm.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import { addTournament } from '../../../utils//firebase/firestore/firestoreActions';
import { formattedTerminationDateTime } from '../../../utils/calculateTerminationDate';

import trophiesImages from '../../../utils/trophiesImages';

const TournamentForm = ({ isCustomMode }) => {
  const { userPlayerProfile } = getUserAuthCtx();
  const nameInput = useRef();
  const defaultAddressInput = useRef();
  const descriptionInput = useRef();
  const [defaultTeamPlayerQuota, setDefaultTeamPlayerQuota] = useState(5);
  const [tournamentImage, setTournamentImage] = useState(
    '/trophies/trophy01.jpg'
  );
  const terminationDateInput = useRef();
  const [pointsPerGameWon, setPointsPerGameWon] = useState(3);
  const hasMvpEnabledInput = useRef();
  const isPublicInput = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (userPlayerProfile)
      nameInput.current.value = `${userPlayerProfile?.username}'s Tournament`;
  }, [userPlayerProfile]);

  const typeOptions = Array.from({ length: 11 }, (_, index) => index + 1);

  const handleSelectType = (number) => {
    setDefaultTeamPlayerQuota(number);
  };

  const handleSelectImage = (image) => {
    setTournamentImage(image);
  };

  const handleSelectPointsPerGameWon = (number) => {
    setPointsPerGameWon(number);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const tournamentTerminationDate = terminationDateInput.current.value;
    const tournamentTerminationTime = '23:59:59';
    const tournamentCombinedTerminationDateTime = `${tournamentTerminationDate}T${tournamentTerminationTime}`;
    const terminationDate = new Date(tournamentCombinedTerminationDateTime);

    const tournamentData = {
      creationDateTime: new Date(),
      isActive: true,

      name: nameInput.current.value,
      defaultAddress: defaultAddressInput?.current?.value || '',
      description: descriptionInput?.current?.value || '',
      defaultPlayerQuota: defaultTeamPlayerQuota * 2,
      image: tournamentImage,
      terminationDate: terminationDate,
      pointsPerGameWon: pointsPerGameWon,
      hasMvpEnabled: hasMvpEnabledInput?.current?.checked || false,
      isPublic: isPublicInput.current.checked,

      creator: userPlayerProfile?.id,
      admins: [userPlayerProfile?.id],
      players: [userPlayerProfile?.id],
    };

    addTournament(tournamentData, userPlayerProfile.id);
    navigate('..');
  };

  return (
    <>
      <form className={styles.tournamentForm} onSubmit={handleSubmit}>
        <fieldset>
          <input
            type='text'
            placeholder='Tournament name'
            ref={nameInput}
            autoFocus
          />
        </fieldset>
        {isCustomMode && (
          <fieldset>
            <input
              type='text'
              placeholder='Tournament default address'
              ref={defaultAddressInput}
            />
          </fieldset>
        )}
        {isCustomMode && (
          <fieldset>
            <textarea
              rows='3'
              placeholder='Description (optional)'
              ref={descriptionInput}></textarea>
          </fieldset>
        )}
        <fieldset className={styles.type}>
          <legend>Select default type of tournament:</legend>
          <div>
            {typeOptions.map((number) => (
              <button
                type='button'
                className={
                  number === defaultTeamPlayerQuota
                    ? styles.selectedPlayerQuota
                    : ''
                }
                key={number}
                onClick={() => handleSelectType(number)}>
                {`F${number}`}
              </button>
            ))}
          </div>
          <legend>{defaultTeamPlayerQuota} players per team</legend>
        </fieldset>
        {isCustomMode && (
          <fieldset className={styles.trophies}>
            <legend>Select an image:</legend>
            <div>
              {trophiesImages.map((image) => (
                <button
                  type='button'
                  key={image}
                  className={
                    image === tournamentImage
                      ? styles.selectedTournamentImage
                      : ''
                  }
                  onClick={() => handleSelectImage(image)}>
                  <img src={image} alt={`${image} image`} />
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <fieldset className={styles.terminationDate}>
          <legend>Select approximate termination date:</legend>
          <input
            type='date'
            defaultValue={formattedTerminationDateTime()}
            ref={terminationDateInput}
          />
          <legend>Tournament ends on {'XX/XX/XXXX'}</legend>
        </fieldset>
        {isCustomMode && (
          <fieldset className={styles.pointsPerGameWon}>
            <legend>Points per match won:</legend>
            <button
              type='button'
              className={
                pointsPerGameWon === 2 ? styles.selectedPointsPerGameWon : ''
              }
              onClick={() => handleSelectPointsPerGameWon(2)}>
              2 points
            </button>
            <button
              type='button'
              className={
                pointsPerGameWon === 3 ? styles.selectedPointsPerGameWon : ''
              }
              onClick={() => handleSelectPointsPerGameWon(3)}>
              3 points
            </button>
          </fieldset>
        )}
        {isCustomMode && (
          <fieldset>
            <label>
              <input type='checkbox' ref={hasMvpEnabledInput} />
              <span>Enable MVP voting.</span>
            </label>
          </fieldset>
        )}
        <fieldset>
          <label>
            <input type='checkbox' ref={isPublicInput} />
            <span>This is a public tournament.</span>
          </label>
        </fieldset>
        <button type='submit'>Confirm</button>
      </form>

      {/* <article>
        <img src='' alt='' />
        <h2>Tournament Summary:</h2>
        <p>Name:</p>
        <p>Default address:</p>
        <p>Description:</p>
        <p>Type:</p>
        <p>Termination date:</p>
        <p>Points per match won:</p>
        <p>MVP voting is {`(not)`} enabled.</p>
        <p>This tournament is {`(public/private)`}</p>
        <p></p>
      </article> */}
    </>
  );
};

export default TournamentForm;
