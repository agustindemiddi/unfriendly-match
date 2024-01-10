import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import PlayersSection from '../../components/players/PlayersSection/PlayersSection';

import { getUserAuthCtx } from '../../context/authContext';
import {
  getPlayers,
  createNonVerifiedPlayerObjectFromFirestore,
} from '../../utils/firebase/firestore/firestoreActions';

const TournamentPlayersPage = () => {
  const { tournamentId } = useParams();
  const { updatedUserTournaments } = getUserAuthCtx();
  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];
  const [tournamentPlayers, setTournamentPlayers] = useState([]);

  useEffect(() => {
    if (tournament) {
      const fetchTournamentPlayers = async () => {
        const verifiedPlayers = await getPlayers(tournament.players);
        const nonVerifiedPlayers = tournament.nonVerifiedPlayers?.map(
          (player) => createNonVerifiedPlayerObjectFromFirestore(player)
        );
        const players = [...verifiedPlayers, ...(nonVerifiedPlayers || [])];

        setTournamentPlayers(players);
      };
      fetchTournamentPlayers();
    }
  }, [tournament]);

  return (
    <>
      {tournament && tournamentPlayers.length > 0 && (
        <PlayersSection tournament={tournament} players={tournamentPlayers} />
      )}
    </>
  );
};

export default TournamentPlayersPage;
