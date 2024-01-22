import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import NewMatchSection from '../../components/matches/NewMatchSection/NewMatchSection';

import { getUserAuthCtx } from '../../context/authContext';
import { getPlayers } from '../../utils/firebase/firestore/firestoreActions';

const NewMatchPage = () => {
  const { tournamentId } = useParams();
  const { userPlayerProfile, updatedUserTournaments } = getUserAuthCtx();
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

  // exclude user from available players:
  const availablePlayers = tournamentPlayers?.filter(
    (player) => player.id !== userPlayerProfile.id
  );

  return (
    <>
      {userPlayerProfile && tournament && tournamentPlayers && (
        <NewMatchSection
          userPlayerProfile={userPlayerProfile}
          tournament={tournament}
          tournamentPlayers={tournamentPlayers}
          availablePlayers={availablePlayers}
        />
      )}
    </>
  );
};

export default NewMatchPage;
