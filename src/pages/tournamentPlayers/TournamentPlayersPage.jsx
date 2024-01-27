import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TournamentPlayersSection from '../../components/tournamentPlayers/TournamentPlayersSection/TournamentPlayersSection';

import { getUserAuthCtx } from '../../context/authContext';
import {
  getTournament,
  getPlayers,
} from '../../utils/firebase/firestore/firestoreActions';

const TournamentPlayersPage = () => {
  const { tournamentId } = useParams();
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedUserTournamentsPlayers,
  } = getUserAuthCtx();
  const [unsubscribedTournament, setUnsubscribedTournament] = useState(null);
  const [players, setPlayers] = useState([]);

  const tournament = updatedUserTournaments?.all?.find(
    (tournament) => tournament.id === tournamentId
  );

  const updatedTournamentPlayers = updatedUserTournamentsPlayers?.filter(
    (player) => tournament.players.includes(player.id)
  );

  useEffect(() => {
    const fetchTournamentAndPlayers = async () => {
      const fetchedTournament = await getTournament(tournamentId);
      setUnsubscribedTournament(fetchedTournament);

      const fetchedPlayers = await getPlayers(fetchedTournament.players);
      setPlayers(fetchedPlayers);
    };
    fetchTournamentAndPlayers();
  }, [tournamentId]);

  // const isUserSubscribedToTournament =
  //   userPlayerProfile?.tournaments?.all?.includes(tournamentId);

  const showContent =
    (tournament || unsubscribedTournament?.isPublic) &&
    (updatedTournamentPlayers.length > 0 || players.length > 0);

  return (
    <>
      {showContent && (
        <TournamentPlayersSection
          tournament={tournament || unsubscribedTournament}
          players={updatedTournamentPlayers || players}
        />
      )}
    </>
  );
};

export default TournamentPlayersPage;
