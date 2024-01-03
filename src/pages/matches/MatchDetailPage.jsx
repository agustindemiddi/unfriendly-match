import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MatchDetailSection from '../../components/tournaments/matches/MatchDetailSection/MatchDetailSection';

import { getMatch } from '../../utils/firebase/firestore/firestoreActions';

const MatchDetailPage = () => {
  const { tournamentId, matchId } = useParams();
  const [match, setMatch] = useState();

  useEffect(() => {
    const fetchMatch = async () => {
      const fetchedMatch = await getMatch(tournamentId, matchId);
      setMatch(fetchedMatch);
    };
    fetchMatch();
  }, [tournamentId, matchId]);

  return <MatchDetailSection match={match} />;
};

export default MatchDetailPage;
