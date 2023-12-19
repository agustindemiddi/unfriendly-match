import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import TournamentDetail from '../../components/Tournaments/TournamentDetail/TournamentDetail';

import {
  getTournament,
  getTournamentMatches,
} from '../../utils/firebase/firestore/firestoreActions';

const TournamentDetailPage = () => {
  const { tournamentId } = useParams();
  // const [tournament, setTournament] = useState({});
  const [tournamentMatches, setTournamentMatches] = useState([]);

  // get tournament:
  // useEffect(() => {
  //   getTournament(tournamentId, setTournament);
  // }, []);

  // get tournament matches:
  useEffect(() => {
    getTournamentMatches(tournamentId, setTournamentMatches);
  }, []);

  return <TournamentDetail matches={tournamentMatches} />;
};

export default TournamentDetailPage;
