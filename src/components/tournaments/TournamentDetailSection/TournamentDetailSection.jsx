import { useParams, useNavigate } from 'react-router-dom';

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
  finishTournament,
  reopenTournament,
} from '../../../utils/firebase/firestore/firestoreActions';
import separateMatches from '../../../utils/separateMatches';
import copyUrlToClipboard from '../../../utils/copyUrlToClipboard';
import {
  calculateTournamentStats,
  getTournamentResults,
} from '../../../utils/calculateTournamentStats';
import {
  sortByPoints,
  sortByGoalDifference,
  sortReverseByGoalDifference,
} from '../../../utils/sortTournamentStats';

const TournamentDetailSection = ({
  userPlayerProfile,
  tournament,
  matches,
  activePlayers,
  inactivePlayers,
}) => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  const { nextMatch, lastMatch } = separateMatches(matches);

  const totalMatches = matches.length;

  const finishedMatches = matches.filter(
    (match) => Object.keys(match.result).length > 0
  );
  const tournamentStats = calculateTournamentStats(finishedMatches);

  const allPlayers = [...activePlayers, ...inactivePlayers]; // allPlayers includes all inactive players except nonVerifiedPlayers that where deleted due to non belonging to any tournament so they were deleted from DB

  const currentTournamentPlayers = tournamentStats.filter((player) =>
    allPlayers.some((allPlayer) => allPlayer.id === Object.keys(player)[0])
  );

  const isTournamentPlayer =
    userPlayerProfile.tournaments.all.includes(tournamentId);
  // tournament?.players?.active.includes(userPlayerProfile?.id);

  const isAdmin = tournament.admins.includes(userPlayerProfile.id);

  const creator = activePlayers.find(
    // add fallbacks if creator left tournament and test
    (player) => player.id === tournament.creator
  );

  const isJoinTournamentRequestDone = tournament.joinRequests.some(
    (joinRequest) => joinRequest.requestedBy === userPlayerProfile.id
  );

  const requiredParticipation = tournament.requiredParticipation;

  const handleUnsubscribeFromTournament = async () => {
    // if (tournament.isActive) {
    // const tournamentPlayers = activePlayers.filter((player) =>
    //   tournament.players.active.includes(player.id)
    // );

    const tournamentVerifiedPlayers = activePlayers.filter(
      (player) => player.isVerified
    );

    const nonVerifiedPlayersIds = activePlayers
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
    // } else {
    //   alert(
    //     `You cannot unsubscribe from finished tournaments. Contact ${creator.displayName} and ask to delete the tournament.`
    //   );
    // }

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
    (tournament.isActive
      ? adminActions.push(
          {
            label: 'Create match',
            onAction: () =>
              navigate(`/tournaments/${tournament.id}/matches/new`),
          },
          {
            label: 'Edit tournament',
            onAction: () => navigate(`/tournaments/${tournament.id}/edit`),
          }
          // {
          //   label: 'Finish tournament',
          //   onAction: () => {
          //     const champion = tournamentStats[0];
          //     const goldenBoot = sortByGoalDifference(tournamentStats)[0];
          //     const poopBoot = sortReverseByGoalDifference(tournamentStats)[0];
          //     const tournamentResults = getTournamentResults(
          //       champion,
          //       goldenBoot,
          //       poopBoot
          //     );
          //     return finishTournament(tournamentId, tournamentResults);
          //   },
          //   color: 'redish',
          // }
        )
      : adminActions.push({
          label: 'Reopen tournament',
          onAction: () => reopenTournament(tournamentId),
          color: 'redish',
        }));
  isTournamentPlayer &&
    isAdmin &&
    tournament.isActive &&
    totalMatches > 0 &&
    adminActions.push({
      label: 'Finish tournament',
      onAction: () => {
        const champion = tournamentStats[0];
        const goldenBoot = sortByGoalDifference(tournamentStats)[0];
        const poopBoot = sortReverseByGoalDifference(tournamentStats)[0];
        const tournamentResults = getTournamentResults(
          champion,
          goldenBoot,
          poopBoot
        );
        return finishTournament(tournamentId, tournamentResults);
      },
      color: 'redish',
    });

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

  const showContent = isTournamentPlayer || tournament.isPublic;
  // const hideContent = !tournament.isPublic && !isTournamentPlayer;
  const showAsideActionsPanel = isTournamentPlayer || tournament.isActive;

  const champion = allPlayers.find(
    (player) => player.id === tournament.results?.champion.id
  );
  const goldenBoot = allPlayers.find(
    (player) => player.id === tournament.results?.goldenBoot.id
  );
  const poopBoot = allPlayers.find(
    (player) => player.id === tournament.results?.poopBoot.id
  );

  return (
    <>
      {showContent ? (
        <>
          <Section row={tournament.isActive ? true : false}>
            {tournament.isActive && isTournamentPlayer && (
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
            )}
            {!tournament.isActive && (
              <>
                <h2>Results:</h2>
                <p>Champion: {champion?.displayName}</p>
                <p>Golden Boot: {goldenBoot?.displayName}</p>
                <p>Poop Boot: {poopBoot?.displayName}</p>
              </>
            )}

            {totalMatches > 0 ? (
              <div className={styles.standings}>
                <StandingsTable
                  totalMatches={totalMatches}
                  requiredParticipation={requiredParticipation}
                  currentTournamentPlayers={currentTournamentPlayers}
                  allPlayers={allPlayers}
                />
              </div>
            ) : <button>Create match</button>}
          </Section>
          {showAsideActionsPanel && (
            <AsideActionsPanel
              initialAction={initialAction}
              adminActions={adminActions}
              actions={actions}
            />
          )}
        </>
      ) : (
        <Section>
          <h2>This tournament is private</h2>
        </Section>
      )}
    </>
  );
};

export default TournamentDetailSection;
