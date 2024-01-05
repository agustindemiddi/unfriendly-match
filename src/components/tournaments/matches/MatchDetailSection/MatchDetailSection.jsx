import { useNavigate } from 'react-router-dom';

import Section from '../../../UI/Section/Section';
import AsideActionsPanel from '../../../UI/AsideActionsPanel/AsideActionsPanel';
import SoccerFieldContainer from '../../../SoccerField/SoccerFieldContainer';

import styles from './MatchDetailSection.module.css';

const MatchDetailSection = ({ match }) => {
  const navigate = useNavigate();

  const adminActions = [
    {
      label: 'Edit match',
      onAction: () => navigate('edit'),
    },
  ];

  const actions = [
    {
      label: 'Back',
      onAction: () => navigate('..'),
    },
  ];

  return (
    <>
      <Section>{match && <SoccerFieldContainer match={match} />}</Section>
      <AsideActionsPanel adminActions={adminActions} actions={actions} />
    </>
  );
};

export default MatchDetailSection;
