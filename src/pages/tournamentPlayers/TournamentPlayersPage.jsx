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
  const { updatedUserTournaments } = getUserAuthCtx();
  const [unsubscribedTournament, setUnsubscribedTournament] = useState([]);
  const [tournamentPlayers, setTournamentPlayers] = useState([]);

  const tournament = updatedUserTournaments?.all?.find(
    (tournament) => tournament.id === tournamentId
  );

  useEffect(() => {
    if (tournament) {
      const fetchTournamentPlayers = async () => {
        const players = await getPlayers(tournament.players);
        setTournamentPlayers(players);
      };
      fetchTournamentPlayers();
    }
  }, [tournament?.players]);

  useEffect(() => {
    if (!tournament) {
      const fetchTournamentAndPlayers = async () => {
        const fetchedTournament = await getTournament(tournamentId);
        setUnsubscribedTournament(fetchedTournament);

        const players = await getPlayers(fetchedTournament.players);
        setTournamentPlayers(players);
      };
      fetchTournamentAndPlayers();
    }
  }, [tournamentId]);

  return (
    <>
      {tournamentPlayers.length > 0 && (
        <TournamentPlayersSection
          tournament={tournament || unsubscribedTournament}
          players={tournamentPlayers}
        />
      )}
    </>
  );
};

export default TournamentPlayersPage;
