import { useNavigate } from 'react-router-dom';

import Section from '../../../UI/Section/Section';
import AsideActionsPanel from '../../../UI/AsideActionsPanel/AsideActionsPanel';
import PlayerForm from '../PlayerForm/PlayerForm';

import styles from './EditPlayerSection.module.css';

const EditPlayerSection = () => {
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
        <PlayerForm />
      </Section>
      <AsideActionsPanel actions={actions} />
    </>
  );
};

export default EditPlayerSection;
