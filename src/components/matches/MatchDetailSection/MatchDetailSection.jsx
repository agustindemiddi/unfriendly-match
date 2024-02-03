import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import SoccerFieldContainer from '../../SoccerField/SoccerFieldContainer';

import styles from './MatchDetailSection.module.css';

const MatchDetailSection = ({ userPlayerProfile, tournament, match }) => {
  const navigate = useNavigate();

  const isAdmin = match?.admins?.includes(userPlayerProfile?.id);

  const adminActions = [];
  isAdmin &&
    adminActions.push({
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
      <Section>
        <SoccerFieldContainer
          userPlayerProfile={userPlayerProfile}
          tournament={tournament}
          match={match}
        />
      </Section>
      <AsideActionsPanel adminActions={adminActions} actions={actions} />
    </>
  );
};

export default MatchDetailSection;
