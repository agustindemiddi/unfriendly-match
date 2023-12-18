import {
  doc,
  getDocs,
  onSnapshot,
  getDoc,
  query,
  collection,
  where,
  documentId,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import db from '../firebaseConfig';

export const createPlayerObjectFromFirestore = (playerDoc) => ({
  ...playerDoc.data(),
  id: playerDoc.id,
  image: playerDoc.data().image ?? '/default-user.svg',
});

export const createMatchObjectFromFirestore = (matchDoc) => ({
  ...matchDoc.data(),
  id: matchDoc.id,
  creationDateTime: matchDoc.data().creationDateTime?.toDate(),
  registryDateTime: matchDoc.data().registryDateTime?.toDate(),
  dateTime: matchDoc.data().dateTime?.toDate(),
});

export const createTournamentObjectFromFirestore = (tournamentDoc) => ({
  ...tournamentDoc.data(),
  id: tournamentDoc.id,
});

const getTournamentDocumentRef = (tournamentId) =>
  doc(db, `tournaments/${tournamentId}`);

const getMatchDocumentRef = (tournamentId, matchId) =>
  doc(db, `tournaments/${tournamentId}/matches/${matchId}`);

const getTournamentMatchesCollectionRef = (tournamentId) =>
  collection(db, 'tournaments', tournamentId, 'matches');

const getTournamentsCollectionRef = () => collection(db, 'tournaments');

// get user active tournaments matches:
export const getUserActiveTournamentsMatches = async (
  userPlayerProfile,
  setUserMatches
) => {
  const userActiveTournamentsMatchesArray = await Promise.all(
    // userPlayerProfile.activeTournaments => userPlayerProfile.tournaments.active
    userPlayerProfile.activeTournaments.map(async (tournamentId) => {
      const querySnapshot = await getDocs(
        getTournamentMatchesCollectionRef(tournamentId)
      );
      const matchesList = querySnapshot.docs.map((matchDoc) =>
        createMatchObjectFromFirestore(matchDoc)
      );
      return matchesList;
    })
  );
  setUserMatches(userActiveTournamentsMatchesArray.flat());
};

// add listener to matchDoc for players property changes:
export const subscribeToMatchChanges = (
  tournamentId,
  matchId,
  // players,
  setUpdatedMatch
) =>
  // add listener to matchDoc
  onSnapshot(
    getMatchDocumentRef(tournamentId, matchId),
    { includeMetadataChanges: true },
    (matchDocSnapshot) => {
      setUpdatedMatch(createMatchObjectFromFirestore(matchDocSnapshot));
      // // check for players property changes:
      // const previousPlayers = players;
      // const currentPlayers = matchDocSnapshot.data()?.players;
      // if (previousPlayers !== currentPlayers) {
      //   setUpdatedMatch((prevState) => ({
      //     ...prevState,
      //     players: currentPlayers,
      //   }));
      // }
    },
    (error) => {
      // error handling
    }
  );

// get tournament image:
export const getTournamentImage = async (tournamentId, setTournamentImage) => {
  const tournamentSnap = await getDoc(getTournamentDocumentRef(tournamentId));
  tournamentSnap.exists()
    ? setTournamentImage(tournamentSnap.data().image)
    : console.log('Tournament not found!');
};

// get match players:
export const getMatchPlayers = async (players, setSubscribedPlayers) => {
  const matchPlayersQuery = query(
    collection(db, 'players'),
    where(documentId(), 'in', players)
  );
  const querySnapshot = await getDocs(matchPlayersQuery);
  const matchPlayersList = querySnapshot.docs.map((playerDoc) =>
    createPlayerObjectFromFirestore(playerDoc)
  );
  setSubscribedPlayers(matchPlayersList);
};

// subscribe user to match:
export const subscribeToMatch = async (tournamentId, matchId, userId) => {
  await updateDoc(getMatchDocumentRef(tournamentId, matchId), {
    players: arrayUnion(userId),
  });
};

// unsubscribe user from match:
export const unsubscribeFromMatch = async (tournamentId, matchId, userId) => {
  await updateDoc(getMatchDocumentRef(tournamentId, matchId), {
    players: arrayRemove(userId),
  });
};

// get match teams:
export const getMatchTeams = async (
  teamAPlayersRefs,
  teamBPlayersRefs,
  setTeams
) => {
  const teamsPlayersRefs = { teamAPlayersRefs, teamBPlayersRefs };
  Object.keys(teamsPlayersRefs).forEach(async (key) => {
    const teamPlayersRefsArray = teamsPlayersRefs[key];
    if (teamPlayersRefsArray.length > 0) {
      const teamPlayersQuery = query(
        collection(db, 'players'),
        where(documentId(), 'in', teamPlayersRefsArray)
      );
      const querySnapshot = await getDocs(teamPlayersQuery);
      const teamPlayersList = querySnapshot.docs.map((playerDoc) =>
        createPlayerObjectFromFirestore(playerDoc)
      );
      const newKey = key === 'teamAPlayersRefs' ? 'teamA' : 'teamB';
      setTeams((prevState) => ({
        ...prevState,
        [newKey]: teamPlayersList,
      }));
    }
  });
};

// get user tournaments:
export const getUserTournaments = async (
  userTournamentsRefsArray,
  setUserTournaments
) => {
  const userTournamentsQuery = query(
    collection(db, 'tournaments'),
    where(documentId(), 'in', userTournamentsRefsArray)
  );
  const querySnapshot = await getDocs(userTournamentsQuery);
  const userTournamentsList = querySnapshot.docs.map((tournamentDoc) =>
    createTournamentObjectFromFirestore(tournamentDoc)
  );
  setUserTournaments(userTournamentsList);
};
