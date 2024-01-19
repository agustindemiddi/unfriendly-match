import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import TournamentForm from '../TournamentForm/TournamentForm';

import styles from './EditTournamentSection.module.css';

const EditTournamentSection = ({ userPlayerProfile, tournament }) => {
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
        <TournamentForm
          isCustomMode={true}
          userPlayerProfile={userPlayerProfile}
          tournament={tournament}
        />
      </Section>
      <AsideActionsPanel actions={actions} />
    </>
  );
};

export default EditTournamentSection;
