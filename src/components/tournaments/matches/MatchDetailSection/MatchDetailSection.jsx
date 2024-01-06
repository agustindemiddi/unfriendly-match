import { useNavigate } from 'react-router-dom';

import Section from '../../../UI/Section/Section';
import AsideActionsPanel from '../../../UI/AsideActionsPanel/AsideActionsPanel';
import SoccerFieldContainer from '../../../SoccerField/SoccerFieldContainer';

import styles from './MatchDetailSection.module.css';

import { getUserAuthCtx } from '../../../../context/authContext';

const MatchDetailSection = ({ match }) => {
  const { userPlayerProfile } = getUserAuthCtx();
  const navigate = useNavigate();

  const isAdmin = match?.admins?.includes(userPlayerProfile?.id);

  const adminActions = [];
  isAdmin && adminActions.push({
    label: 'Edit match',
    onAction: () => navigate('edit'),
  });

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
