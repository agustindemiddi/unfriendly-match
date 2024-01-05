import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import TournamentForm from '../TournamentForm/TournamentForm';

import styles from './NewTournamentSection.module.css';

const NewTournamentSection = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Cancel',
      onAction: () => navigate('..'),
    },
  ];

  return (
    <>
      <Section>
        <TournamentForm />
      </Section>
      <AsideActionsPanel actions={actions} />
    </>
  );
};

export default NewTournamentSection;
