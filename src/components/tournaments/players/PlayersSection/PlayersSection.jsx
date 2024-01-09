import { useNavigate } from 'react-router-dom';

import Section from '../../../UI/Section/Section';
import AsideActionsPanel from '../../../UI/AsideActionsPanel/AsideActionsPanel';
import PlayersList from './PlayersList/PlayersList';

import styles from './PlayersSection.module.css';

import { getUserAuthCtx } from '../../../../context/authContext';

const PlayersSection = ({ tournament, players }) => {
  const { updatedUserPlayerProfile } = getUserAuthCtx();
  const navigate = useNavigate();

  const isTournamentPlayer = tournament?.players?.includes(
    updatedUserPlayerProfile?.id
  );

  const isAdmin = tournament?.admins?.includes(updatedUserPlayerProfile?.id);

  const adminActions = [];
  isTournamentPlayer &&
    isAdmin &&
    adminActions.push({
      label: 'Create provisory player',
      onAction: () => navigate(`/tournaments/${tournament.id}/players/new`),
      color: 'greenish',
    });

  const actions = [
    {
      label: 'Back',
      onAction: () => navigate('..'),
    },
  ];

  return (
    <>
      <Section>
        <h2>{tournament.name} players:</h2>
        {players.length > 0 && <PlayersList players={players} />}
      </Section>
      <AsideActionsPanel adminActions={adminActions} actions={actions} />
    </>
  );
};

export default PlayersSection;
