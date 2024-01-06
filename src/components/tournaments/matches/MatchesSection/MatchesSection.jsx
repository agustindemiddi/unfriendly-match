import { useNavigate } from 'react-router-dom';

import Section from '../../../UI/Section/Section';
import AsideActionsPanel from '../../../UI/AsideActionsPanel/AsideActionsPanel';
import MatchesList from './MatchesList/MatchesList';

import styles from './MatchesSection.module.css';

import { getUserAuthCtx } from '../../../../context/authContext';
import separateMatches from '../../../../utils/separateMatches';

const MatchesSection = ({ matches, tournament }) => {
  const { userPlayerProfile } = getUserAuthCtx();
  const navigate = useNavigate();

  const isAdmin = tournament?.admins?.includes(userPlayerProfile?.id);

  const {
    sortedUpcomingMatches,
    reverseSortedPreviousMatches,
    nextMatch,
    lastMatch,
  } = separateMatches(matches);

  const adminActions = [];
  isAdmin &&
    adminActions.push({
      label: 'Create match',
      onAction: () => {
        navigate('new');
      },
      color: 'greenish',
    });

  const actions = [
    {
      label: 'Back',
      onAction: () => {
        navigate('..', { relative: 'path' });
      },
    },
  ];

  return (
    <>
      <Section>
        <h2>UPCOMING MATCHES</h2>
        {sortedUpcomingMatches && sortedUpcomingMatches.length > 0 && (
          <MatchesList matches={sortedUpcomingMatches} />
        )}
        <h2>PREVIOUS MATCHES</h2>
        {reverseSortedPreviousMatches &&
          reverseSortedPreviousMatches.length > 0 && (
            <MatchesList matches={reverseSortedPreviousMatches} />
          )}
      </Section>
      <AsideActionsPanel adminActions={adminActions} actions={actions} />
    </>
  );
};

export default MatchesSection;
