import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import ActionsBar from '../../UI/ActionsBar/ActionsBar';
import TournamentsList from './TournamentsList/TournamentsList';

import styles from './TournamentsSection.module.css';

import separateTournaments from '../../../utils/separateTournaments';

const TournamentsSection = ({ tournaments }) => {
  const { active: activeTournaments, finished: finishedTournaments } =
    separateTournaments(tournaments);
  const navigate = useNavigate();
  const [isFinishedTournamentsShown, setIsFinishedTournamentsShown] =
    useState(false);

  const actions = [
    {
      label: 'Create new tournament',
      onAction: () => {
        navigate('/tournaments/new');
      },
    },
    {
      label: `${
        isFinishedTournamentsShown ? 'Hide' : 'Show'
      } finished tournaments`,
      onAction: () => {
        setIsFinishedTournamentsShown((prevState) => !prevState);
      },
    },
  ];

  let activeTournamentsContent = (
    <p>You don't have any active tournaments yet.</p>
  );
  if (activeTournaments?.length > 0)
    activeTournamentsContent = (
      <div className={styles.tournamentType}>
        <h2>Active Tournaments:</h2>
        <TournamentsList tournaments={activeTournaments} />
      </div>
    );

  let finishedTournamentsContent = (
    <p>You don't have any finished tournaments yet.</p>
  );
  if (finishedTournaments?.length > 0)
    finishedTournamentsContent = (
      <div className={styles.tournamentType}>
        <h2>Finished Tournaments:</h2>
        <TournamentsList tournaments={finishedTournaments} />
      </div>
    );

  return (
    <Section>
      <ActionsBar actions={actions} />
      {activeTournamentsContent}
      {isFinishedTournamentsShown && finishedTournamentsContent}
    </Section>
  );
};

export default TournamentsSection;
