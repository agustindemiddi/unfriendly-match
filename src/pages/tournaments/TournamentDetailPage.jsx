import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TournamentDetailSection from '../../components/tournaments/TournamentDetailSection/TournamentDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
import {
  getTournament,
  getTournamentMatches,
} from '../../utils/firebase/firestore/firestoreActions';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams();
  const { updatedUserTournaments } = getUserAuthCtx();
  const subscribedTournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];
  const [tournament, setTournament] = useState([]);
  const [tournamentMatches, setTournamentMatches] = useState([]);

  useEffect(() => {
    if (!subscribedTournament) {
      const fetchTournament = async () => {
        const fetchedTournament = await getTournament(tournamentId);
        setTournament(fetchedTournament);
      };
      fetchTournament();
    }

    // get tournament matches:
    const fetchTournamentMatches = async () => {
      const matches = await getTournamentMatches(tournamentId);
      setTournamentMatches(matches);
    };
    fetchTournamentMatches();
  }, [tournamentId]);

  return (
    <>
      {updatedUserTournaments && tournamentMatches && (
        <TournamentDetailSection
          tournament={subscribedTournament || tournament}
          matches={tournamentMatches}
        />
      )}
    </>
  );
};

export default TournamentDetailPage;
