// import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MatchDetailSection from '../../components/matches/MatchDetailSection/MatchDetailSection';

import { getUserAuthCtx } from '../../context/authContext';
// import { getMatch } from '../../utils/firebase/firestore/firestoreActions';

const MatchDetailPage = () => {
  const { tournamentId, matchId } = useParams();
  const {
    userPlayerProfile,
    updatedUserTournaments,
    updatedActiveTournamentsMatches,
  } = getUserAuthCtx();
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

  const tournament = updatedUserTournaments?.all?.find(
    (tournament) => tournament.id === tournamentId
  );

  const match = updatedActiveTournamentsMatches?.find(
    (match) => match.id === matchId
  );

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
  return (
    <>
      {userPlayerProfile && tournament && match && (
        <MatchDetailSection
          userPlayerProfile={userPlayerProfile}
          tournament={tournament}
          match={match}
        />
      )}
    </>
  );
};

export default MatchDetailPage;
