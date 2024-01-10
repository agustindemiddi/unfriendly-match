import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import PlayerForm from '../PlayerForm/PlayerForm';

import styles from './NewPlayerSection.module.css';

const NewPlayerSection = () => {
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
        <PlayerForm />
      </Section>
      <AsideActionsPanel actions={actions} />
    </>
  );
};

export default NewPlayerSection;
