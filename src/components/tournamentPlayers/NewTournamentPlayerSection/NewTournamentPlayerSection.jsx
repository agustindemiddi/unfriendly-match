import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import PreviousNonVerifiedPlayersList from './PreviousNonVerifiedPlayersList';
import TournamentPlayerForm from '../TournamentPlayerForm/TournamentPlayerForm';

import styles from './NewTournamentPlayerSection.module.css';

const NewTournamentPlayerSection = ({
  userPlayerProfile,
  previousNonVerifiedPlayers,
}) => {
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
        {previousNonVerifiedPlayers.length > 0 && (
          <>
            <h2>Non-verified players from your other tournaments:</h2>
            <PreviousNonVerifiedPlayersList
              previousNonVerifiedPlayers={previousNonVerifiedPlayers}
            />
          </>
        )}
        <TournamentPlayerForm userPlayerProfile={userPlayerProfile} />
      </Section>
      <AsideActionsPanel actions={actions} />
    </>
  );
};

export default NewTournamentPlayerSection;
