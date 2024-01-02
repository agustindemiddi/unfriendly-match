import Section from '../../UI/Section/Section';
import ActionsBar from '../../UI/ActionsBar/ActionsBar';
import MatchForm from '../MatchForm/MatchForm';

import styles from './NewMatchSection.module.css';

const NewMatchSection = () => {
  return (
    <Section>
      <ActionsBar />
      <MatchForm />
    </Section>
  );
};

export default NewMatchSection;
