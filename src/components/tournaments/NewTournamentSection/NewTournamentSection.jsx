import Section from '../../UI/Section/Section';
import ActionsBar from '../../UI/ActionsBar/ActionsBar';
import TournamentForm from '../TournamentForm/TournamentForm';

import styles from './NewTournamentSection.module.css';

const NewTournamentSection = () => {
  return (
    <Section>
      <ActionsBar />
      <TournamentForm />
    </Section>
  );
};

export default NewTournamentSection;
