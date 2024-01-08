import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import SoccerFieldContainer from '../../SoccerField/SoccerFieldContainer';
import StandingsTable from './StandingsTable/StandingsTable';

import styles from './TournamentDetailSection.module.css';

import { getUserAuthCtx } from '../../../context/authContext';
import separateMatches from '../../../utils/separateMatches';
import copyUrlToClipboard from '../../../utils/copyUrlToClipboard';
import {
  subscribeToTournament,
  unsubscribeFromTournament,
} from '../../../utils/firebase/firestore/firestoreActions';

const TournamentDetailSection = ({ tournament, matches }) => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [isTournamentPlayer, setIsTournamentPlayer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      userPlayerProfile &&
      tournament?.players?.includes(userPlayerProfile.id)
    ) {
      setIsTournamentPlayer(true);
    } else {
      setIsTournamentPlayer(false);
    }
  }, [userPlayerProfile?.tournaments.all, tournament.players]);

  const isAdmin = tournament?.admins?.includes(userPlayerProfile?.id);

  const handleSubscribeToTournament = () => {
    subscribeToTournament(tournament.id, userPlayerProfile.id, tournament.name);
    setIsTournamentPlayer(true);
  };

  const handleUnsubscribeFromTournament = () => {
    unsubscribeFromTournament(
      tournament.id,
      userPlayerProfile.id,
      tournament.name
    );
    // setIsTournamentPlayer(false);
    navigate('..');
  };

  const { nextMatch, lastMatch } = separateMatches(matches);

  const initialAction = {};
  if (!isTournamentPlayer) {
    initialAction.label = 'Join!';
    initialAction.onAction = handleSubscribeToTournament;
    initialAction.color = 'greenish';
  }

  const adminActions = [];
  isTournamentPlayer &&
    isAdmin &&
    adminActions.push(
      {
        label: 'Create match',
        onAction: () => navigate(`/tournaments/${tournament.id}/matches/new`),
        color: 'greenish',
      },
      {
        label: 'Edit tournament',
        onAction: () => navigate(`/tournaments/${tournament.id}/edit`),
      }
    );

  const actions = [];
  isTournamentPlayer &&
    actions.push(
      {
        label: 'Matches',
        onAction: () => navigate(`/tournaments/${tournament.id}/matches`),
      },
      {
        label: 'Players',
        onAction: () => navigate(`/tournaments/${tournament.id}/players`),
      },
      {
        label: 'Share tournament',
        onAction: copyUrlToClipboard,
      },
      {
        label: 'Leave tournament',
        onAction: handleUnsubscribeFromTournament,
        color: 'redish',
      }
    );

  return (
    <>
      <Section row>
        <div className={styles.matches}>
          {nextMatch && (
            <>
              <h2>Next Match:</h2>
              <SoccerFieldContainer match={nextMatch} />
            </>
          )}
          {lastMatch && (
            <>
              <h2>Last Match:</h2>
              <SoccerFieldContainer match={lastMatch} />
            </>
          )}
        </div>

        <div className={styles.standings}>
          <StandingsTable />
        </div>
      </Section>
      <AsideActionsPanel
        initialAction={initialAction}
        adminActions={adminActions}
        actions={actions}
      />
    </>
  );
};

export default TournamentDetailSection;
