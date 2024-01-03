import { useNavigate } from 'react-router-dom';

import Section from '../../../UI/Section/Section';
import PlayersList from './PlayersList/PlayersList';

import styles from './PlayersSection.module.css';

import { getUserAuthCtx } from '../../../../context/authContext';

const PlayersSection = ({ tournament, players }) => {
  const { userPlayerProfile } = getUserAuthCtx();
  const navigate = useNavigate();

  const isTournamentPlayer = tournament?.players?.includes(
    userPlayerProfile.id
  );

  const isAdmin = tournament?.admins?.includes(userPlayerProfile.id);

  const adminActions = [];
  isTournamentPlayer &&
    isAdmin &&
    adminActions.push({
      label: 'Create provisory player',
      onAction: () => {
        navigate(`/tournaments/${tournament.id}/players/new`);
      },
      color: 'green',
    });

  return (
    <Section adminActions={adminActions}>
      <h2>{tournament.name} players:</h2>
      {players.length > 0 && <PlayersList players={players} />}
    </Section>
  );
};

export default PlayersSection;
