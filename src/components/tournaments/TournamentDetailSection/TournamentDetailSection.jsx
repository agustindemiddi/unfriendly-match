import { useNavigate } from 'react-router-dom';

import Section from '../../UI/Section/Section';
import AsideActionsPanel from '../../UI/AsideActionsPanel/AsideActionsPanel';
import SoccerFieldContainer from '../../SoccerField/SoccerFieldContainer';
import StandingsTable from './StandingsTable/StandingsTable';

import styles from './TournamentDetailSection.module.css';

import {
  requestJoinTournament,
  cancelJoinTournamentRequest,
  unsubscribeFromTournament,
  deleteTournament,
} from '../../../utils/firebase/firestore/firestoreActions';
import separateMatches from '../../../utils/separateMatches';
import copyUrlToClipboard from '../../../utils/copyUrlToClipboard';

const TournamentDetailSection = ({
  userPlayerProfile,
  tournament,
  matches,
  players,
}) => {
  const navigate = useNavigate();

  const { nextMatch, lastMatch } = separateMatches(matches);

  const isTournamentPlayer = tournament?.players?.includes(
    userPlayerProfile?.id
  );

  const isAdmin = tournament?.admins?.includes(userPlayerProfile.id);

  const isJoinTournamentRequestDone = tournament?.joinRequests?.some(
    (joinRequest) => joinRequest.requestedBy === userPlayerProfile.id
  );

  const handleUnsubscribeFromTournament = async () => {
    if (tournament.isActive) {
      const tournamentPlayers = players.filter((player) =>
        tournament.players.includes(player.id)
      );

      const tournamentVerifiedPlayers = tournamentPlayers.filter(
        (player) => player.isVerified
      );

      const nonVerifiedPlayersIds = tournamentPlayers
        .filter((player) => !player.isVerified)
        .map((player) => player.id);

      if (tournamentVerifiedPlayers.length > 1) {
        await unsubscribeFromTournament(tournament.id, userPlayerProfile.id);
        alert(`You have successfully abandoned ${tournament.name}.`);
      } else {
        deleteTournament(
          tournament.id,
          userPlayerProfile.id,
          nonVerifiedPlayersIds
        );
        alert(
          `You have successfully abandoned the tournament. You were the last player of ${tournament.name}, so the tournament was deleted from the database.`
        );
      }
    } else {
      alert(
        `You cannot unsubscribe from finished tournaments. Contact ${tournament.creator} and ask to delete the tournament.`
      );
    }

    navigate('..');
  };

  const initialAction = {};
  if (!isTournamentPlayer && isJoinTournamentRequestDone) {
    initialAction.label = 'Cancel request!';
    initialAction.onAction = () =>
      cancelJoinTournamentRequest(tournament, userPlayerProfile);
  } else if (!isTournamentPlayer) {
    initialAction.label = 'Join!';
    initialAction.onAction = () =>
      requestJoinTournament(tournament, userPlayerProfile);
    initialAction.color = 'greenish';
  }

  const adminActions = [];
  isTournamentPlayer &&
    isAdmin &&
    adminActions.push(
      {
        label: 'Create match',
        onAction: () => navigate(`/tournaments/${tournament.id}/matches/new`),
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
              <SoccerFieldContainer
                userPlayerProfile={userPlayerProfile}
                match={nextMatch}
                tournament={tournament}
              />
            </>
          )}
          {lastMatch && (
            <>
              <h2>Last Match:</h2>
              <SoccerFieldContainer
                userPlayerProfile={userPlayerProfile}
                match={lastMatch}
                tournament={tournament}
              />
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
