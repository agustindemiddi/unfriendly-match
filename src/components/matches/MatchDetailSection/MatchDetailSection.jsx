import { Link } from 'react-router-dom';

import ActionsBar from '../../UI/ActionsBar/ActionsBar';

import styles from './MatchDetailSection.module.css';

import Section from '../../UI/Section/Section';
import SoccerFieldContainer from '../../SoccerField/SoccerFieldContainer';

const MatchDetailSection = ({ match }) => {
  return (
    <Section>
      <ActionsBar />
      {match && <SoccerFieldContainer match={match} />}
      <Link to='edit'>
        <button>editar PARTIDO</button>
      </Link>
    </Section>
  );
};

export default MatchDetailSection;
