import { useParams } from 'react-router-dom';

import MatchesSection from '../../components/tournaments/matches/MatchesSection/MatchesSection';

import { getUserAuthCtx } from '../../context/authContext';

const MatchesPage = () => {
  const { tournamentId } = useParams();
  const { updatedUserTournaments, tournamentMatches } = getUserAuthCtx();
  const tournament = updatedUserTournaments?.all?.filter(
    (tournament) => tournament.id === tournamentId
  )[0];

  return (
    <>
      {tournamentMatches && (
        <MatchesSection matches={tournamentMatches} tournament={tournament} />
      )}
    </>
  );
};

export default MatchesPage;
