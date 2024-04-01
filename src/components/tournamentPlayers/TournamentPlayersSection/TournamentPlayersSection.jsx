import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import TournamentPlayersList from './TournamentPlayersList/TournamentPlayersList';

import styles from './TournamentPlayersSection.module.css';

const TournamentPlayersSection = ({
  userPlayerProfile,
  tournament,
  players,
}) => {
  const navigate = useNavigate();

  const isTournamentPlayer = tournament?.players?.active.includes(
    userPlayerProfile?.id
  );

  const isUserAdmin = tournament.admins.includes(userPlayerProfile.id);

  const isUserCreator = tournament.creator === userPlayerProfile.id;

  const admins = tournament.admins;

  const adminActions = [];
  isTournamentPlayer &&
    isUserAdmin &&
    tournament.isActive &&
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

  const showContent = isTournamentPlayer || tournament.isPublic;

  return (
    <>
      {showContent ? (
        <>
          <Section>
            <h2>{tournament.name} players:</h2>
            {players.length > 0 && (
              <TournamentPlayersList
                players={players}
                isUserCreator={isUserCreator}
                admins={admins}
              />
            )}
          </Section>
          <AsideActionsPanel adminActions={adminActions} actions={actions} />
        </>
      ) : (
        'This tournament is private'
      )}
    </>
  );
};

export default TournamentPlayersSection;
