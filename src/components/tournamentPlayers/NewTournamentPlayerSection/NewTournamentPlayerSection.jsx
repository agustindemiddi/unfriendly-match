import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import TournamentPlayerForm from '../TournamentPlayerForm/TournamentPlayerForm';

import styles from './NewTournamentPlayerSection.module.css';

const NewTournamentPlayerSection = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Back',
      onAction: () => navigate('..'),
    },
  ];

  return (
    <>
      <Section>
        <TournamentPlayerForm />
      </Section>
      <AsideActionsPanel actions={actions} />
    </>
  );
};

export default NewTournamentPlayerSection;
