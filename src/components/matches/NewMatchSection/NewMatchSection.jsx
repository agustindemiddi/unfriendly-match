import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import MatchForm from '../MatchForm/MatchForm';

import styles from './NewMatchSection.module.css';

const NewMatchSection = ({
  userPlayerProfile,
  tournament,
  tournamentPlayers,
  availablePlayers,
}) => {
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
        <MatchForm
          userPlayerProfile={userPlayerProfile}
          tournament={tournament}
          tournamentPlayers={tournamentPlayers}
          availablePlayers={availablePlayers}
        />
      </Section>
      <AsideActionsPanel actions={actions} />
    </>
  );
};

export default NewMatchSection;
