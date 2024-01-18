import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './TournamentForm.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import {
  addTournament,
  editTournament,
} from '../../../utils//firebase/firestore/firestoreActions';
import { getFormattedTerminationDate } from '../../../utils/getTerminationDate';

import trophiesImages from '../../../utils/trophiesImages';

const TournamentForm = ({ isCustomMode, isEditMode, tournament }) => {
  const { userPlayerProfile, setUserPlayerProfile } = getUserAuthCtx();

  const nameInput = useRef();
  const defaultAddressInput = useRef();
  const descriptionInput = useRef();

  const [defaultTeamPlayerQuota, setDefaultTeamPlayerQuota] = useState(
    !isEditMode ? 5 : null
  );
  const [defaultMatchDay, setDefaultMatchDay] = useState('');
  const [defaultMatchTime, setDefaultMatchTime] = useState('');
  const [
    isSubscriptionStartsImmediatelySelected,
    setIsSubscriptionStartsImmediatelySelected,
  ] = useState(true);
  const [
    defaultMatchSubscriptionDaysBefore,
    setDefaultMatchSubscriptionDaysBefore,
  ] = useState('notSet');
  const [defaultMatchSubscriptionTime, setDefaultMatchSubscriptionTime] =
    useState('');
  const [tournamentImage, setTournamentImage] = useState(
    '/trophies/trophy01.jpg'
  );
  const [terminationDate, setTerminationDate] = useState(
    getFormattedTerminationDate()
  );
  const defaultMatchTimeInput = useRef();
  const defaultMatchSubscriptionDaysBeforeSelect = useRef();
  const defaultMatchSubscriptionTimeInput = useRef();
  const terminationDateInput = useRef();
  const [pointsPerGameWon, setPointsPerGameWon] = useState(3);
  const hasMvpEnabledInput = useRef();
  const isPublicInput = useRef();
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (userPlayerProfile)
      nameInput.current.value =
        tournament?.name ?? `${userPlayerProfile?.displayName}'s Tournament`;
  }, [userPlayerProfile, tournament?.name]);

  useEffect(() => {
    tournament?.defaultPlayerQuota &&
      setDefaultTeamPlayerQuota(tournament.defaultPlayerQuota / 2);

    tournament?.defaultMatchDay &&
      setDefaultMatchDay(tournament.defaultMatchDay);

    tournament?.defaultMatchTime &&
      setDefaultMatchTime(tournament.defaultMatchTime);

    if (
      tournament?.defaultMatchSubscriptionDaysBefore ||
      tournament?.defaultMatchSubscriptionDaysBefore === 0
    ) {
      setIsSubscriptionStartsImmediatelySelected(false);
      setDefaultMatchSubscriptionDaysBefore(
        tournament.defaultMatchSubscriptionDaysBefore
      );
    }

    if (tournament?.defaultMatchSubscriptionTime) {
      setIsSubscriptionStartsImmediatelySelected(false);
      setDefaultMatchSubscriptionTime(tournament.defaultMatchSubscriptionTime);
    }

    if (
      tournament?.defaultMatchSubscriptionDaysBefore === 0 &&
      tournament.defaultMatchSubscriptionTime > tournament.defaultMatchTime
    ) {
      setIsSubscriptionStartsImmediatelySelected(false);
      setDefaultMatchSubscriptionTime(tournament.defaultMatchSubscriptionTime);
    }

    tournament?.image && setTournamentImage(tournament.image);

    // const updatedTerminationDate = tournament?.terminationDate
    //   ? getFormattedTerminationDate(tournament.terminationDate)
    //   : getFormattedTerminationDate();
    // terminationDateInput.current.value = updatedTerminationDate;
    tournament?.terminationDate &&
      setTerminationDate(
        getFormattedTerminationDate(tournament.terminationDate)
      );
  }, [
    tournament?.defaultPlayerQuota,
    tournament?.defaultMatchDay,
    tournament?.defaultMatchTime,
    tournament?.defaultMatchSubscriptionDaysBefore,
    tournament?.defaultMatchSubscriptionTime,
    tournament?.image,
    tournament?.terminationDate,
  ]);

  const typeOptions = Array.from({ length: 11 }, (_, index) => index + 1);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedWeekDay =
    defaultMatchDay === 0
      ? 'Sunday'
      : defaultMatchDay === 1
      ? 'Monday'
      : defaultMatchDay === 2
      ? 'Tuesday'
      : defaultMatchDay === 3
      ? 'Wednesday'
      : defaultMatchDay === 4
      ? 'Thursday'
      : defaultMatchDay === 5
      ? 'Friday'
      : 'Saturday';

  const pointsPerGameWonOptions = [2, 3];

  const handleSelectSubscriptionStartsImmediately = () => {
    setIsSubscriptionStartsImmediatelySelected(true);
    setDefaultMatchSubscriptionDaysBefore('notSet');
    setDefaultMatchSubscriptionTime('');
  };

  const handleDefaultMatchSubscriptionTimeChange = (event) => {
    if (defaultMatchSubscriptionDaysBefore === 0 && !defaultMatchTime) {
      alert(
        'If you select the subscription to start the same day as the matches, you must also specify the time when the matches will normally be played'
      );
      return;
    }

    const inputTime = event.target.value;
    const maxTime =
      defaultMatchTime && defaultMatchSubscriptionDaysBefore === 0
        ? defaultMatchTime
        : inputTime;

    if (inputTime > maxTime) {
      setDefaultMatchSubscriptionTime(maxTime);
    } else {
      setDefaultMatchSubscriptionTime(inputTime);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (defaultMatchSubscriptionDaysBefore !== 'notSet' && !defaultMatchDay) {
      alert(
        'If you customize the subscription start day, you must also specify the day of the week the matches are usually played'
      );
      return;
    }

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
      defaultPlayerQuota: defaultTeamPlayerQuota
        ? defaultTeamPlayerQuota * 2
        : null,
      defaultMatchDay: defaultMatchDay || null,
      defaultMatchTime: defaultMatchTimeInput?.current?.value || '',
      defaultMatchSubscriptionDaysBefore:
        defaultMatchSubscriptionDaysBefore === 'notSet'
          ? null
          : defaultMatchSubscriptionDaysBefore,
      defaultMatchSubscriptionTime: defaultMatchSubscriptionTime || '',
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
      const newTournamentId = uuidv4();

      await addTournament(
        userPlayerProfile.id,
        tournamentData,
        newTournamentId
      );

      setUserPlayerProfile((prevState) => ({
        ...prevState,
        tournaments: {
          all: [...prevState.tournaments.all, newTournamentId],
          active: [...prevState.tournaments.active, newTournamentId],
        },
      }));

      alert(`You have successfully created ${tournamentData.name}`);
    }
    if (isEditMode) {
      await editTournament(tournamentId, tournamentData);

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
            name='tournament-name'
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
              name='default-address'
              placeholder='Tournament default address'
              defaultValue={tournament?.defaultAddress}
              ref={defaultAddressInput}
            />
          </fieldset>
        )}
        {isCustomMode && (
          <fieldset>
            <textarea
              name='tournament-description'
              rows='3'
              placeholder='Description (optional)'
              defaultValue={tournament?.description}
              ref={descriptionInput}></textarea>
          </fieldset>
        )}
        <fieldset className={styles.type}>
          <legend>Select default type of matches:</legend>
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
                onClick={() =>
                  number === defaultTeamPlayerQuota
                    ? setDefaultTeamPlayerQuota(null)
                    : setDefaultTeamPlayerQuota(number)
                }>
                {`F${number}`}
              </button>
            ))}
          </div>
          <legend>
            {defaultTeamPlayerQuota
              ? `${defaultTeamPlayerQuota} players per team`
              : 'You have not selected the default type of match for this tournament'}
          </legend>
        </fieldset>
        {isCustomMode && (
          <fieldset className={styles.defaultMatchDay}>
            <legend>Select default match day:</legend>
            <div>
              {weekDays.map((weekDay, index) => (
                <button
                  type='button'
                  key={index}
                  className={
                    index === defaultMatchDay ? styles.selectedMatchDay : ''
                  }
                  onClick={() =>
                    index === defaultMatchDay
                      ? setDefaultMatchDay(null)
                      : setDefaultMatchDay(index)
                  }>
                  {weekDay}
                </button>
              ))}
            </div>
            <legend>
              {defaultMatchDay
                ? `Normally, matches are played on ${selectedWeekDay}s`
                : 'You have not selected the default day of the week for the matches of this tournament'}
            </legend>
          </fieldset>
        )}
        {isCustomMode && (
          <fieldset className={styles.defaultMatchTime}>
            <legend>Select default match time:</legend>
            <input
              type='time'
              name='default-match-time'
              onChange={(event) => setDefaultMatchTime(event.target.value)}
              value={defaultMatchTime}
              ref={defaultMatchTimeInput}
            />
            <legend>
              {defaultMatchTime
                ? `Normally, matches are played at ${defaultMatchTime}`
                : 'You have not set the default start time for the matches of this tournament'}
            </legend>
          </fieldset>
        )}

        {isCustomMode && (
          <fieldset className={styles.defaultMatchSubscriptionDateTime}>
            <legend>Select default match subscription day and time:</legend>
            <div
              className={
                isSubscriptionStartsImmediatelySelected
                  ? styles.selectedSubscriptionDateTime
                  : ''
              }
              onClick={handleSelectSubscriptionStartsImmediately}>
              <span>
                Subscripton starts immediately
                <br />
                after match creation
              </span>
            </div>

            <div
              className={
                !isSubscriptionStartsImmediatelySelected
                  ? styles.selectedSubscriptionDateTime
                  : ''
              }
              onClick={() => setIsSubscriptionStartsImmediatelySelected(false)}>
              <select
                onChange={(event) =>
                  setDefaultMatchSubscriptionDaysBefore(
                    parseInt(event.target.value)
                  )
                }
                name='default-match-subscription-days-before'
                value={defaultMatchSubscriptionDaysBefore}
                ref={defaultMatchSubscriptionDaysBeforeSelect}>
                <option value='notSet' disabled>
                  Select days before
                </option>
                <option value='0'>Same day</option>
                <option value='1'>1 day before</option>
                <option value='2'>2 days before</option>
                <option value='3'>3 days before</option>
                <option value='4'>4 days before</option>
                <option value='5'>5 days before</option>
                <option value='6'>6 days before</option>
                <option value='7'>7 days before</option>
              </select>
              <input
                type='time'
                onChange={handleDefaultMatchSubscriptionTimeChange}
                name='default-match-subscription-time'
                value={defaultMatchSubscriptionTime}
                ref={defaultMatchSubscriptionTimeInput}
              />
            </div>
          </fieldset>
        )}

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
                  onClick={() => setTournamentImage(image)}>
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
            onChange={(event) => setTerminationDate(event.target.value)}
            name='termination-date'
            value={terminationDate}
            // defaultValue={getFormattedTerminationDate()}
            ref={terminationDateInput}
            required
          />
          {terminationDate && (
            <legend>Tournament ends around {terminationDate}</legend>
          )}
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
                onClick={() => setPointsPerGameWon(points)}>
                {points} points
              </button>
            ))}
          </fieldset>
        )}
        {!isEditMode && isCustomMode && (
          <fieldset>
            <label>
              <input type='checkbox' name='has-mvp' ref={hasMvpEnabledInput} />
              <span>Enable MVP voting.</span>
            </label>
          </fieldset>
        )}
        <fieldset>
          <label>
            <input
              type='checkbox'
              name='is-public'
              defaultChecked={tournament?.isPublic}
              ref={isPublicInput}
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
