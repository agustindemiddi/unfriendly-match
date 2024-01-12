// import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MatchDetailSection from '../../components/matches/MatchDetailSection/MatchDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
// import { getMatch } from '../../utils/firebase/firestore/firestoreActions';

const MatchDetailPage = () => {
  const { tournamentId, matchId } = useParams();
  const { updatedUserTournaments, tournamentMatches } = getUserAuthCtx();
  // const [matchFromUnsubscribedTournament, setMatchFromUnsubscribedTournament] =
  //   useState([]);

  // eventualmente necesito un fallback para que usuarios no suscriptos al torneo puedan visualizarlo si es torneo público
  // useEffect(() => {
  //   if (!subscribedTournament) {
  //     const fetchMatch = async () => {
  //       const fetchedMatch = await getMatch(matchId);
  //       setMatchFromUnsubscribedTournament(fetchedMatch);
  //     };
  //     fetchMatch();
  //   }
  // }, [tournamentId]);

  // const subscribedTournament = updatedUserTournaments?.all?.filter(
  //   (tournament) => tournament.id === tournamentId
  // )[0];

  const match = tournamentMatches?.filter((match) => match.id === matchId)[0];

  // return (
  //   <>
  //     {match ||
  //       (matchFromUnsubscribedTournament && (
  //         <MatchDetailSection
  //           match={match || matchFromUnsubscribedTournament}
  //         />
  //       ))}
  //   </>
  // );
  return <>{match && <MatchDetailSection match={match} />}</>;
};

export default MatchDetailPage;
