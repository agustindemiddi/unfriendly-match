import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import EditMatchSection from '../../components/matches/EditMatchSection/EditMatchSection';

import { getUserAuthCtx } from '../../context/authContext';
import { getPlayers } from '../../utils/firebase/firestore/firestoreActions';

const EditMatchPage = () => {
  const { tournamentId, matchId } = useParams();
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedTournamentMatches,
  } = getUserAuthCtx();
  const [tournamentPlayers, setTournamentPlayers] = useState(null);
  const tournament = updatedUserTournaments?.all?.find(
    (tournament) => tournament.id === tournamentId
  );

  useEffect(() => {
    if (tournament?.players) {
      const fetchPlayers = async () => {
        const players = await getPlayers(tournament.players);
        setTournamentPlayers(players);
      };
      fetchPlayers();
    }
  }, [tournament?.players]);

  const match = updatedTournamentMatches?.find((match) => match.id === matchId);

  const matchPlayers = tournamentPlayers?.filter((player) =>
    match?.players.includes(player.id)
  );

  const availablePlayers = tournamentPlayers?.filter(
    (player) => !match?.players.includes(player.id)
  );

  return (
    <>
      {userPlayerProfile && tournament && tournamentPlayers && match && (
        <EditMatchSection
          userPlayerProfile={userPlayerProfile}
          tournament={tournament}
          tournamentPlayers={tournamentPlayers}
          match={match}
          matchPlayers={matchPlayers}
          availablePlayers={availablePlayers}
        />
      )}
    </>
  );
};

export default EditMatchPage;
