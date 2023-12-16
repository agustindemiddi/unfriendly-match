import {
  query,
  collection,
  where,
  documentId,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import db from '../../../utils/firebase/firebaseConfig';

// HANDLERS:

export const createPlayerObjectFromFirestore = (playerDoc) => ({
  id: playerDoc.id,
  username: playerDoc.data().username,
  image: playerDoc.data().image ?? '/default-user.svg',
});

const getTournamentRef = (tournamentId) =>
  doc(db, `tournaments/${tournamentId}`);

const getMatchRef = (tournamentId, matchId) =>
  doc(db, `tournaments/${tournamentId}/matches/${matchId}`);

// FIRESTORE QUERIES:

// fetch match:
export const fetchMatch = async (tournamentId, matchId) => {
  const matchRef = getMatchRef(tournamentId, matchId);
  const matchSnap = await getDoc(matchRef);
  matchSnap.exists()
    ? console.log('matchData: ', matchSnap.data())
    : console.log('Match not found!');
};

// ACTIONS:

// add listener to matchDoc for players property changes:
export const subscribeToMatchChanges = (
  tournamentId,
  matchId,
  players,
  setUpdatedMatch
) =>
  onSnapshot(
    doc(db, `tournaments/${tournamentId}/matches/${matchId}`),
    { includeMetadataChanges: true },
    (matchDocSnapshot) => {
      // Check for changes in the "players" property
      const previousPlayers = players;
      const currentPlayers = matchDocSnapshot.data()?.players;
      if (previousPlayers !== currentPlayers) {
        setUpdatedMatch((prevState) => ({
          ...prevState,
          players: currentPlayers,
        }));
      }
    },
    (error) => {
      // error handling
    }
  );

// get tournament image:
export const getTournamentImage = async (tournamentId, setTournamentImage) => {
  const tournamentSnap = await getDoc(getTournamentRef(tournamentId));
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

// subscribe user to match:
export const subscribeToMatch = async (tournamentId, matchId, userId) => {
  await updateDoc(getMatchRef(tournamentId, matchId), {
    players: arrayUnion(userId),
  });
};

// unsubscribe user to match:
export const unsubscribeFromMatch = async (tournamentId, matchId, userId) => {
  await updateDoc(getMatchRef(tournamentId, matchId), {
    players: arrayRemove(userId),
  });
};
