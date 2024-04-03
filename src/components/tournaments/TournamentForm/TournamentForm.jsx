import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import styles from './TournamentForm.module.css';

import {
  addTournament,
  editTournament,
} from '../../../utils//firebase/firestore/firestoreActions';
import {
  getInputFormattedTerminationDate,
  getInputFormattedMaxTerminationDate,
} from '../../../utils/getDates';

import trophiesImages from '../../../utils/trophiesImages';

const TournamentForm = ({ isCustomMode, userPlayerProfile, tournament }) => {
  const nameInputRef = useRef();
  const [tournamentName, setTournamentName] = useState(
    tournament?.name
      ? tournament.name
      : userPlayerProfile
      ? `${userPlayerProfile?.displayName}'s Tournament`
      : ''
  );
  const defaultAddressInputRef = useRef();
  const descriptionInputRef = useRef();
  const [defaultTeamPlayerQuota, setDefaultTeamPlayerQuota] = useState(
    tournament?.defaultPlayerQuota ? tournament.defaultPlayerQuota / 2 : 5
  );
  const [defaultMatchDay, setDefaultMatchDay] = useState(
    tournament?.defaultMatchDay || ''
  );
  const [defaultMatchTime, setDefaultMatchTime] = useState(
    tournament?.defaultMatchTime || ''
  );
  const [
    isSubscriptionStartsImmediatelySelected,
    setIsSubscriptionStartsImmediatelySelected,
  ] = useState(tournament?.defaultMatchSubscriptionTime ? false : true);
  const [
    defaultMatchSubscriptionDaysBefore,
    setDefaultMatchSubscriptionDaysBefore,
  ] = useState(
    tournament?.defaultMatchSubscriptionDaysBefore ||
      tournament?.defaultMatchSubscriptionDaysBefore === 0
      ? tournament?.defaultMatchSubscriptionDaysBefore
      : 'notSet'
  );
  const [defaultMatchSubscriptionTime, setDefaultMatchSubscriptionTime] =
    useState(tournament?.defaultMatchSubscriptionTime || '');
  const [tournamentImage, setTournamentImage] = useState(
    tournament?.image || '/trophies/trophy01.jpg'
  );
  const [terminationDate, setTerminationDate] = useState(
    tournament?.terminationDate
      ? getInputFormattedTerminationDate(tournament.terminationDate)
      : getInputFormattedTerminationDate()
  );
  const [pointsPerGameWon, setPointsPerGameWon] = useState(3);
  const hasMvpEnabledInput = useRef();
  const isPublicInput = useRef();
  const { tournamentId } = useParams();
  const navigate = useNavigate();

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

  const handleDefaultMatchTimeChange = (event) => {
    const inputTime = event.target.value;
    setDefaultMatchTime(inputTime);
    if (
      defaultMatchSubscriptionDaysBefore === 0 &&
      defaultMatchSubscriptionTime > inputTime
    ) {
      setDefaultMatchSubscriptionTime(inputTime);
    }
  };

  const handleSubscriptionStartsImmediately = () => {
    setIsSubscriptionStartsImmediatelySelected(true);
    setDefaultMatchSubscriptionDaysBefore('notSet');
    setDefaultMatchSubscriptionTime('');
  };

  const handleSubscriptionStartsCustomized = () => {
    if (!defaultMatchDay || !defaultMatchTime) {
      alert(
        'If you want to customize the subscription start, you must first specify the day and time when the matches will normally be played'
      );
      return;
    }
    setIsSubscriptionStartsImmediatelySelected(false);
  };

  const handleDefaultMatchSubscriptionDaysBeforeChange = (event) => {
    const inputDaysBefore = parseInt(event.target.value);
    setDefaultMatchSubscriptionDaysBefore(inputDaysBefore);
    if (
      inputDaysBefore === 0 &&
      defaultMatchSubscriptionTime > defaultMatchTime
    ) {
      setDefaultMatchSubscriptionTime(defaultMatchTime);
    }
  };

  const handleDefaultMatchSubscriptionTimeChange = (event) => {
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

  const handleTerminationDateChange = (event) => {
    const initialDate = tournament?.creationDateTime || new Date();
    const maxDate = getInputFormattedMaxTerminationDate(initialDate);
    const inputDate = event.target.value;
    if (inputDate > maxDate) {
      setTerminationDate(maxDate);
    } else {
      setTerminationDate(inputDate);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !isSubscriptionStartsImmediatelySelected &&
      (defaultMatchSubscriptionDaysBefore === 'notSet' ||
        !defaultMatchSubscriptionTime)
    ) {
      alert(
        'You must specify the default date and time of the subscription or select the subscription to start immediately after match creation!'
      );
      return;
    }

    const tournamentData = {
      creationDateTime: tournament?.creationDateTime || new Date(),
      isActive: tournament?.isActive ?? true,

      requiredParticipation: 50, // temporary hardcoded

      name:
        nameInputRef.current.value ||
        `${userPlayerProfile?.displayName}'s Tournament`,
      defaultAddress: defaultAddressInputRef?.current?.value || '',
      description: descriptionInputRef?.current?.value || '',
      defaultPlayerQuota: defaultTeamPlayerQuota
        ? defaultTeamPlayerQuota * 2
        : null,
      defaultMatchDay: defaultMatchDay || null,
      defaultMatchTime: defaultMatchTime || '',
      defaultMatchSubscriptionDaysBefore:
        defaultMatchSubscriptionDaysBefore === 'notSet'
          ? null
          : defaultMatchSubscriptionDaysBefore,
      defaultMatchSubscriptionTime: defaultMatchSubscriptionTime || '',
      image: tournamentImage || '',
      terminationDate: new Date(`${terminationDate}T23:59:59`),
      pointsPerGameWon: tournament?.pointsPerGameWon || pointsPerGameWon,
      hasMvpEnabled: hasMvpEnabledInput?.current?.checked || false,
      isPublic: isPublicInput.current.checked || false,

      creator: tournament?.creator || userPlayerProfile?.id,
      admins: tournament?.admins || [userPlayerProfile?.id],
      players: {
        active: tournament?.players.active || [userPlayerProfile?.id],
        inactive: tournament?.players.inactive || [], 
      },
      joinRequests: tournament?.joinRequests || [],
      matches: tournament?.matches || [],
    };

    if (tournament) {
      await editTournament(tournamentId, tournamentData);
      alert(`You have successfully edited ${tournamentData.name}`);
    } else {
      const newTournamentId = uuidv4();
      await addTournament(
        newTournamentId,
        userPlayerProfile.id,
        tournamentData
      );
      alert(`You have successfully created ${tournamentData.name}`);
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
            ref={nameInputRef}
            defaultValue={tournamentName}
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
              ref={defaultAddressInputRef}
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
              ref={descriptionInputRef}></textarea>
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
            {defaultTeamPlayerQuota === 1
              ? `${defaultTeamPlayerQuota} player per team`
              : defaultTeamPlayerQuota
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
              {defaultMatchDay || defaultMatchDay === 0
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
              onChange={handleDefaultMatchTimeChange}
              value={defaultMatchTime}
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
              onClick={handleSubscriptionStartsImmediately}>
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
              onClick={handleSubscriptionStartsCustomized}>
              <select
                name='default-match-subscription-days-before'
                onChange={handleDefaultMatchSubscriptionDaysBeforeChange}
                value={defaultMatchSubscriptionDaysBefore}>
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
                name='default-match-subscription-time'
                onChange={handleDefaultMatchSubscriptionTimeChange}
                value={defaultMatchSubscriptionTime}
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
            name='termination-date'
            onChange={handleTerminationDateChange}
            value={terminationDate}
            required
          />
          {terminationDate && (
            <legend>Tournament ends around {terminationDate}</legend>
          )}
        </fieldset>
        {!tournament && isCustomMode && (
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
        {!tournament && isCustomMode && (
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
        <button type='submit'>
          {tournament ? 'Update Tournament' : 'Create Tournament'}
        </button>
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
