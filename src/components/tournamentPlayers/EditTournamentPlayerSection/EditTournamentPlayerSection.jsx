import { useNavigate, useLocation } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import TournamentPlayerForm from '../TournamentPlayerForm/TournamentPlayerForm';

import styles from './EditTournamentPlayerSection.module.css';

const EditTournamentPlayerSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // console.log(location.state);

  const actions = [
    {
      label: 'Cancel',
      onAction: () => navigate('..'),
    },
  ];

  return (
    <>
      <Section>
        <TournamentPlayerForm player={location.state} />
      </Section>
      <AsideActionsPanel actions={actions} />
    </>
  );
};

export default EditTournamentPlayerSection;
