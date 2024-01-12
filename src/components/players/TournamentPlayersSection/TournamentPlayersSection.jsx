import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import PlayersList from './PlayersList/PlayersList';

import styles from './TournamentPlayersSection.module.css';

import { getUserAuthCtx } from '../../../context/authContext';

const TournamentPlayersSection = ({ tournament, players }) => {
  const { userPlayerProfile } = getUserAuthCtx();
  const navigate = useNavigate();

  const isTournamentPlayer = tournament?.players?.includes(
    userPlayerProfile?.id
  );

  const isAdmin = tournament?.admins?.includes(userPlayerProfile?.id);

  const adminActions = [];
  isTournamentPlayer &&
    isAdmin &&
    adminActions.push({
      label: 'Create provisory player',
      onAction: () => navigate(`/tournaments/${tournament.id}/players/new`),
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

export default TournamentPlayersSection;
