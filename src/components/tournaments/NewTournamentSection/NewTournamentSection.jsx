import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import TournamentForm from '../TournamentForm/TournamentForm';

import styles from './NewTournamentSection.module.css';

const NewTournamentSection = () => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: `${isCustomMode ? 'Quick' : 'Custom'} mode`,
      onAction: () => setIsCustomMode((prevState) => !prevState),
    },
    {
      label: 'Cancel',
      onAction: () => navigate('..'),
    },
  ];

  return (
    <>
      <Section>
        <TournamentForm isCustomMode={isCustomMode} />
      </Section>
      <AsideActionsPanel actions={actions} />
    </>
  );
};

export default NewTournamentSection;
