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

const TournamentDetailSection = ({ tournament, matches, setTournament }) => {
  const { userPlayerProfile, setUserPlayerProfile } = getUserAuthCtx();
  const navigate = useNavigate();

  const isTournamentPlayer = tournament?.players?.includes(
    userPlayerProfile?.id
  );

  const isAdmin = tournament?.admins?.includes(userPlayerProfile?.id);

  const handleSubscribeToTournament = () => {
    subscribeToTournament(tournament.id, userPlayerProfile.id);
    setUserPlayerProfile((prevState) => ({
      ...prevState,
      tournaments: {
        all: Array.from(new Set([...prevState.tournaments.all, tournament.id])),
        active: Array.from(
          new Set([...prevState.tournaments.active, tournament.id])
        ),
      },
    }));
    setTournament((prevState) => ({
      ...prevState,
      players: Array.from(
        new Set([...prevState.players, userPlayerProfile.id])
      ),
    }));
    alert(`You have successfully joined ${tournament.name}`);
  };

  const handleUnsubscribeFromTournament = () => {
    unsubscribeFromTournament(tournament.id, userPlayerProfile.id);
    setUserPlayerProfile((prevState) => ({
      ...prevState,
      tournaments: {
        all: prevState.tournaments.all.filter(
          (tournamentId) => tournamentId !== tournament.id
        ),
        active: prevState.tournaments.active.filter(
          (tournamentId) => tournamentId !== tournament.id
        ),
      },
    }));
    setTournament((prevState) => ({
      ...prevState,
      players: prevState.players.filter(
        (playerId) => playerId !== userPlayerProfile.id
      ),
    }));

    if (tournament.players.length > 1) {
      alert(`You have successfully abandoned ${tournament.name}.`);
    } else {
      alert(
        `You have successfully abandoned the tournament. You were the last player of ${tournament.name}, so the tournament was deleted from the database.`
      );
    }

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
