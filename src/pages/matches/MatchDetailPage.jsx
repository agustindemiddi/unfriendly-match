import { useParams } from 'react-router-dom';

import MatchDetailSection from '../../components/matches/MatchDetailSection/MatchDetailSection';

import { getUserAuthCtx } from '../../context/authContext';

const MatchDetailPage = () => {
  const { matchId } = useParams();
  const { tournamentMatches } = getUserAuthCtx();
  const match = tournamentMatches?.filter((match) => match.id === matchId)[0];

  return <>{match && <MatchDetailSection match={match} />}</>;
};

export default MatchDetailPage;
