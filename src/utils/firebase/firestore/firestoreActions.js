import {
  doc,
  Timestamp,
  setDoc,
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

// DOCUMENTS AND COLLECTIONS REFERENCES
const getPlayerDocRef = (playerId) => doc(db, `players/${playerId}`);

const getTournamentDocRef = (tournamentId) =>
  doc(db, `tournaments/${tournamentId}`);

const getMatchDocRef = (tournamentId, matchId) =>
  doc(db, `tournaments/${tournamentId}/matches/${matchId}`);

const getPlayersColRef = () => collection(db, 'players');

const getTournamentsColRef = () => collection(db, 'tournaments');

const getTournamentMatchesColRef = (tournamentId) =>
  collection(db, `tournaments/${tournamentId}/matches`);

// OBJECT CREATION FROM FIRESTORE DOCUMENT
export const createPlayerObjectFromFirestore = (playerDoc) => ({
  ...playerDoc.data(),
  id: playerDoc.id,
  image: playerDoc.data()?.image || '/default-user.svg',
});

export const createTournamentObjectFromFirestore = (tournamentDoc) => ({
  ...tournamentDoc.data(),
  id: tournamentDoc.id,
  creationDateTime: tournamentDoc.data().creationDateTime?.toDate(),
  terminationDate: tournamentDoc.data().terminationDate?.toDate(),
});

export const createMatchObjectFromFirestore = (matchDoc) => ({
  ...matchDoc.data(),
  id: matchDoc.id,
  creationDateTime: matchDoc.data().creationDateTime?.toDate(),
  registryDateTime: matchDoc.data().registryDateTime?.toDate(),
  dateTime: matchDoc.data().dateTime?.toDate(),
});

// FIRESTORE GENERIC ACTIONS
// get a document:
export const getDocument = async (docRef) => {
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap : new Error('Document not found!');
};

// APP SPECIFIC ACTIONS
// get player:
export const getPlayer = async (playerId) => {
  const playerDoc = await getDocument(getPlayerDocRef(playerId));
  return createPlayerObjectFromFirestore(playerDoc);
};

export const getMatch = async (tournamentId, matchId) => {
  const matchDoc = await getDocument(getMatchDocRef(tournamentId, matchId));
  return createMatchObjectFromFirestore(matchDoc);
};

// AUTHCONTEXT
// create player profile object from user (first time sign up)
export const createPlayerObjectFromUser = (
  id,
  displayName,
  profilePicture
) => ({
  creationDateTime: Timestamp.now(),
  isVerified: true,
  isPublic: false,
  username: `${displayName}_${id}`,
  displayName: displayName,
  image: profilePicture || '',
  description: '',
  tournaments: {
    all: [],
    active: [],
    finished: [],
  },
});

// get player profile (when user signs in)
export const getPlayerProfileFromUser = async (currentUser) => {
  const { uid } = currentUser;
  const playerDoc = await getDoc(getPlayerDocRef(uid));
  if (playerDoc.exists()) {
    return createPlayerObjectFromFirestore(playerDoc);
  } else {
    const signInMethod = currentUser.providerData[0].providerId;
    if (signInMethod === 'google.com') {
      const { displayName, photoURL } = currentUser;
      const playerData = createPlayerObjectFromUser(uid, displayName, photoURL);
      await setDoc(getPlayerDocRef(uid), playerData);
      return playerData;
    } else if (signInMethod === 'password') {
      const displayName = currentUser.email.split('@')[0];
      const playerData = createPlayerObjectFromUser(uid, displayName);
      await setDoc(getPlayerDocRef(uid), playerData);
      return playerData;
    }
  }
};

// HOMEPAGE
// get user active tournaments matches:
export const getUserActiveTournamentsMatches = async (tournamentsIdsArray) => {
  if (tournamentsIdsArray.length > 0) {
    const userActiveTournamentsMatchesArray = await Promise.all(
      tournamentsIdsArray.map(async (tournamentId) => {
        const querySnapshot = await getDocs(
          getTournamentMatchesColRef(tournamentId)
        );
        const matchesList = querySnapshot.docs.map((matchDoc) =>
          createMatchObjectFromFirestore(matchDoc)
        );
        return matchesList;
      })
    );
    return userActiveTournamentsMatchesArray.flat();
  }
};

// TOURNAMENTS PAGE <<< REEMPLAZAR POR FUNCION NUEVA MAS ABAJO CON CHEQUEO IF PARA NO TENER ARRAY VACIO >>>
// get user tournaments:
export const getUserTournaments = async (userTournamentsRefsArray) => {
  const userTournamentsQuery = query(
    getTournamentsColRef(),
    where(documentId(), 'in', userTournamentsRefsArray)
  );
  try {
    const querySnapshot = await getDocs(userTournamentsQuery);
    const userTournamentsList = await Promise.all(
      querySnapshot.docs.map(async (tournamentDoc) =>
        createTournamentObjectFromFirestore(tournamentDoc)
      )
    );
    return userTournamentsList;
  } catch (error) {
    console.error('Error fetching user tournaments:', error);
    throw error;
  }
};

// TOURNAMENT DETAIL PAGE
// get tournament:
export const getTournament = async (tournamentId) => {
  const tournamentDoc = await getDocument(getTournamentDocRef(tournamentId));
  return createTournamentObjectFromFirestore(tournamentDoc);
};

// get tournament matches:
export const getTournamentMatches = async (tournamentId) => {
  const querySnapshot = await getDocs(getTournamentMatchesColRef(tournamentId));
  const tournamentMatchesArray = querySnapshot.docs.map((matchDoc) =>
    createMatchObjectFromFirestore(matchDoc)
  );
  return tournamentMatchesArray;
};

// TOURNAMENT DETAIL
// subscribe user to tournament:
export const subscribeToTournament = async (tournamentId, userId) => {
  await updateDoc(getTournamentDocRef(tournamentId), {
    players: arrayUnion(userId),
  });
  await updateDoc(getPlayerDocRef(userId), {
    'tournaments.all': arrayUnion(tournamentId),
    'tournaments.active': arrayUnion(tournamentId),
  });
  alert('You have joined this tournament!');
};

// TOURNAMENT PLAYERS
// get players:
export const getPlayers = async (playersIdsArray) => {
  if (playersIdsArray.length > 0) {
    const playersQuery = query(
      getPlayersColRef(),
      where(documentId(), 'in', playersIdsArray)
    );
    const querySnapshot = await getDocs(playersQuery);
    const playersList = querySnapshot.docs.map((playerDoc) =>
      createPlayerObjectFromFirestore(playerDoc)
    );
    return playersList;
  }
};

// SOCCERFIELD CONTAINER
// add listener to matchDoc:
export const subscribeToMatchChanges = (
  tournamentId,
  matchId,
  setUpdatedMatch
) =>
  onSnapshot(
    getMatchDocRef(tournamentId, matchId),
    { includeMetadataChanges: true },
    (matchDoc) => setUpdatedMatch(createMatchObjectFromFirestore(matchDoc)),
    (error) => {
      // handle error
      console.log(error);
    }
  );

// get tournament (re-used)

// get players (re-used)

// subscribe user to match:
export const subscribeToMatch = async (tournamentId, matchId, userId) => {
  await updateDoc(getMatchDocRef(tournamentId, matchId), {
    players: arrayUnion(userId),
  });
};

// unsubscribe user from match:
export const unsubscribeFromMatch = async (tournamentId, matchId, userId) => {
  await updateDoc(getMatchDocRef(tournamentId, matchId), {
    players: arrayRemove(userId),
  });
};

// get match teams:
export const getMatchTeams = async (
  teamAPlayersIds,
  teamBPlayersIds
  // setTeams
) => {
  let teams = { teamA: [], teamB: [] };
  const teamsPlayersIds = { teamAPlayersIds, teamBPlayersIds };
  Object.keys(teamsPlayersIds).forEach(async (key) => {
    const teamPlayersIdsArray = teamsPlayersIds[key];
    if (teamPlayersIdsArray.length > 0) {
      const teamPlayersQuery = query(
        getPlayersColRef(),
        where(documentId(), 'in', teamPlayersIdsArray)
      );
      const querySnapshot = await getDocs(teamPlayersQuery);
      const teamPlayersList = querySnapshot.docs.map((playerDoc) =>
        createPlayerObjectFromFirestore(playerDoc)
      );
      const newKey = key === 'teamAPlayersRefs' ? 'teamA' : 'teamB';
      teams[newKey] = teamPlayersList;
    }
  });
  return teams;
};

// CONTACTS PAGE
// get tournaments: (UNIFICAR CON FUNCION MAS ARRIBA) + // HOMEPAGE
export const getTournaments = async (tournamentsIdsArray) => {
  if (tournamentsIdsArray.length > 0) {
    const tournamentsQuery = query(
      getTournamentsColRef(),
      where(documentId(), 'in', tournamentsIdsArray)
    );
    const querySnapshot = await getDocs(tournamentsQuery);
    const tournamentsList = querySnapshot.docs.map((tournamentDoc) =>
      createTournamentObjectFromFirestore(tournamentDoc)
    );
    return tournamentsList;
  }
};

// get players (re-used)
