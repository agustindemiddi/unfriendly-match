import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './TournamentForm.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import {
  addTournament,
  editTournament,
} from '../../../utils//firebase/firestore/firestoreActions';
import { formattedTerminationDateTime } from '../../../utils/calculateTerminationDate';

import trophiesImages from '../../../utils/trophiesImages';

const TournamentForm = ({ isCustomMode, isEditMode, tournament }) => {
  const { userPlayerProfile, setUserPlayerProfile } = getUserAuthCtx();
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
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (userPlayerProfile)
      nameInput.current.value =
        tournament?.name ?? `${userPlayerProfile?.username}'s Tournament`;
  }, [userPlayerProfile, tournament?.name]);

  useEffect(() => {
    tournament?.defaultPlayerQuota &&
      setDefaultTeamPlayerQuota(tournament.defaultPlayerQuota / 2);

    tournament?.image && setTournamentImage(tournament.image);

    const updatedTerminationDate = tournament?.terminationDate
      ? formattedTerminationDateTime(tournament.terminationDate)
      : formattedTerminationDateTime();
    terminationDateInput.current.value = updatedTerminationDate;
  }, [
    tournament?.defaultPlayerQuota,
    tournament?.image,
    tournament?.terminationDate,
  ]);

  const typeOptions = Array.from({ length: 11 }, (_, index) => index + 1);

  const pointsPerGameWonOptions = [2, 3];

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

    const newTournamentId = uuidv4();

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

    if (!isEditMode) {
      setUserPlayerProfile((prevState) => ({
        ...prevState,
        tournaments: {
          all: Array.from(
            new Set([...prevState.tournaments.all, newTournamentId])
          ),
          active: Array.from(
            new Set([...prevState.tournaments.active, newTournamentId])
          ),
        },
      }));

      addTournament(newTournamentId, tournamentData, userPlayerProfile.id);

      alert(`You have successfully created ${tournamentData.name}`);
    }
    if (isEditMode) {
      editTournament(tournamentId, tournamentData);
      alert(`You have successfully edited ${tournamentData.name}`);
    }
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
            required
          />
        </fieldset>
        {isCustomMode && (
          <fieldset>
            <input
              type='text'
              placeholder='Tournament default address'
              defaultValue={tournament?.defaultAddress}
              ref={defaultAddressInput}
            />
          </fieldset>
        )}
        {isCustomMode && (
          <fieldset>
            <textarea
              rows='3'
              placeholder='Description (optional)'
              defaultValue={tournament?.description}
              ref={descriptionInput}></textarea>
          </fieldset>
        )}
        <fieldset className={styles.type}>
          <legend>Select default type of tournament:</legend>
          <div>
            {typeOptions.map((number) => (
              <button
                type='button'
                key={number}
                className={
                  number === defaultTeamPlayerQuota
                    ? styles.selectedPlayerQuota
                    : ''
                }
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
            required
          />
          {/* will need state to live update */}
          <legend>Tournament ends on {'XX/XX/XXXX'}</legend>
        </fieldset>
        {!isEditMode && isCustomMode && (
          <fieldset className={styles.pointsPerGameWon}>
            <legend>Points per match won:</legend>
            {pointsPerGameWonOptions.map((points) => (
              <button
                type='button'
                key={points}
                className={
                  pointsPerGameWon === points
                    ? styles.selectedPointsPerGameWon
                    : ''
                }
                onClick={() => handleSelectPointsPerGameWon(points)}>
                {points} points
              </button>
            ))}
          </fieldset>
        )}
        {!isEditMode && isCustomMode && (
          <fieldset>
            <label>
              <input type='checkbox' ref={hasMvpEnabledInput} />
              <span>Enable MVP voting.</span>
            </label>
          </fieldset>
        )}
        <fieldset>
          <label>
            <input
              type='checkbox'
              ref={isPublicInput}
              defaultChecked={tournament?.isPublic}
            />
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
