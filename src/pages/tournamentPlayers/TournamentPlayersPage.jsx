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
  const { userPlayerProfile } = getUserAuthCtx();
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchTournamentAndPlayers = async () => {
      const fetchedTournament = await getTournament(tournamentId);
      setTournament(fetchedTournament);

      const fetchedPlayers = await getPlayers(fetchedTournament.players);
      setPlayers(fetchedPlayers);
    };
    fetchTournamentAndPlayers();
  }, [tournamentId]);

  const isUserSubscribedToTournament =
    userPlayerProfile?.tournaments?.all?.includes(tournamentId);

  const showContent =
    tournament &&
    players.length > 0 &&
    (isUserSubscribedToTournament || tournament.isPublic);

  return (
    <>
      {showContent && (
        <TournamentPlayersSection tournament={tournament} players={players} />
      )}
    </>
  );
};

export default TournamentPlayersPage;
