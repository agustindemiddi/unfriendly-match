import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import ActionsBar from '../../UI/ActionsBar/ActionsBar';
import TournamentsList from './TournamentsList/TournamentsList';

import styles from './TournamentsSection.module.css';

import separateTournaments from '../../../utils/separateTournaments';

const TournamentsSection = ({ tournaments }) => {
  const { active, finished } = separateTournaments(tournaments);
  const tournamentTypeLists = [active, finished];
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Create New Tournament',
      onAction: () => {
        navigate('/tournaments/new');
      },
    },
  ];

  return (
    <Section>
      <ActionsBar actions={actions} />
      {tournamentTypeLists.map((tournamentsList, index) => (
        <div className={styles.tournamentType} key={index}>
          {tournamentsList.length > 0 && (
            <>
              <h2>{index === 0 ? 'Active' : 'Finished'} Tournaments:</h2>
              <TournamentsList tournaments={tournamentsList} />
            </>
          )}
        </div>
      ))}
    </Section>
  );
};

export default TournamentsSection;
