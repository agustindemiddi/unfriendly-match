import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TournamentPlayersSection from '../../components/tournamentPlayers/TournamentPlayersSection/TournamentPlayersSection';

import { getUserAuthCtx } from '../../context/authContext';
import {
  getTournament,
  getPlayers,
} from '../../utils/firebase/firestore/firestoreActions';
import LoadingBouncingSoccerBall from '../../components/UI/LoadingBouncingSoccerBall/LoadingBouncingSoccerBall';

const TournamentPlayersPage = () => {
  const { tournamentId } = useParams();
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedUserTournamentsPlayers,
  } = getUserAuthCtx();
  const [unsubscribedTournament, setUnsubscribedTournament] = useState(null);
  const [players, setPlayers] = useState([]);

  const tournament = updatedUserTournaments.all.find(
    (tournament) => tournament.id === tournamentId
  );

  const updatedTournamentPlayers = updatedUserTournamentsPlayers.filter(
    (player) => player.tournaments.all.includes(tournamentId)
  );

  // fetch if don't participate on tournament; maybe I can avoid second fetch even if first fetch is forcely done.
  useEffect(() => {
    const fetchTournamentAndPlayers = async () => {
      const fetchedTournament = await getTournament(tournamentId);
      setUnsubscribedTournament(fetchedTournament);

      const fetchedPlayers = await getPlayers(fetchedTournament.players);
      setPlayers(fetchedPlayers);
    };
    fetchTournamentAndPlayers();
  }, [tournamentId]);

  let isLoading = true;
  if (
    (tournament || unsubscribedTournament) &&
    (updatedTournamentPlayers.length > 0 || players.length > 0)
  )
    isLoading = false;

  const showContent = tournament || unsubscribedTournament?.isPublic;

  return (
    <>
      {isLoading ? (
        <LoadingBouncingSoccerBall />
      ) : (
        <TournamentPlayersSection
          userPlayerProfile={userPlayerProfile}
          tournament={tournament || unsubscribedTournament}
          players={updatedTournamentPlayers || players}
        />
      )}
    </>
  );
};

export default TournamentPlayersPage;
