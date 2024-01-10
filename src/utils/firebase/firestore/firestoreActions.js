import {
  doc,
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
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import db from '../firebaseConfig';

const currentDateTime = new Date();

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
export const createNonVerifiedPlayerObjectFromFirestore = (playerDoc) => ({
  ...playerDoc,
  creationDateTime: playerDoc.creationDateTime?.toDate(),
  image: '/default-user.svg',
  isVerified: false, // not sure if necessary yet
});

export const createPlayerObjectFromFirestore = (playerDoc) => ({
  ...playerDoc.data(),
  id: playerDoc.id,
  creationDateTime: playerDoc.data().creationDateTime?.toDate(),
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
  subscriptionDateTime: matchDoc.data().subscriptionDateTime?.toDate(),
  dateTime: matchDoc.data().dateTime?.toDate(),
});

// FIRESTORE GENERIC ACTIONS
// get a document:
export const getDocument = async (docRef) => {
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap : new Error('Document not found!');
};

// Add a document:
const addDocument = async (colRef, data) => {
  const docRef = await addDoc(colRef, data);
};

// APP SPECIFIC ACTIONS
// create player profile object from user (first time sign up):
export const createPlayerObjectFromUser = (
  id,
  displayName,
  profilePicture
) => ({
  creationDateTime: currentDateTime,
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

// get player profile (when user signs in):
export const getPlayerProfileFromUser = async (currentUser) => {
  const { uid } = currentUser;
  const playerDoc = await getDoc(getPlayerDocRef(uid));
  if (playerDoc.exists()) {
    const player = createPlayerObjectFromFirestore(playerDoc);
    return player;
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

// get player:
export const getPlayer = async (playerId) => {
  const playerDoc = await getDocument(getPlayerDocRef(playerId));
  const player = createPlayerObjectFromFirestore(playerDoc);
  return player;
};

// get tournament:
export const getTournament = async (tournamentId) => {
  const tournamentDoc = await getDocument(getTournamentDocRef(tournamentId));
  const tournament = createTournamentObjectFromFirestore(tournamentDoc);
  return tournament;
};

// add tournament:
export const addTournament = async (
  userId,
  tournamentData,
  newTournamentId
) => {
  await setDoc(getTournamentDocRef(newTournamentId), tournamentData);

  await updateDoc(getPlayerDocRef(userId), {
    'tournaments.all': arrayUnion(newTournamentId),
    'tournaments.active': arrayUnion(newTournamentId),
  });
};

// edit tournament:
export const editTournament = async (tournamentId, tournamentData) =>
  await updateDoc(getTournamentDocRef(tournamentId), tournamentData);

// add non-verified player to tournament:
export const addNonVerifiedPlayerToTournament = async (
  tournamentId,
  playerData
) => {
  await updateDoc(getTournamentDocRef(tournamentId), {
    nonVerifiedPlayers: arrayUnion(playerData),
  });
};

// get match:
export const getMatch = async (tournamentId, matchId) => {
  const matchDoc = await getDocument(getMatchDocRef(tournamentId, matchId));
  const match = createMatchObjectFromFirestore(matchDoc);
  return match;
};

// add match:
export const addMatch = async (tournamentId, matchData) => {
  await addDoc(getTournamentMatchesColRef(tournamentId), matchData);
};

// get multiple players:
export const getPlayers = async (playersIdsArray) => {
  if (playersIdsArray.length > 0) {
    const playersQuery = query(
      getPlayersColRef(),
      where(documentId(), 'in', playersIdsArray)
    );
    const querySnapshot = await getDocs(playersQuery);
    const playersArray = querySnapshot.docs.map((playerDoc) =>
      createPlayerObjectFromFirestore(playerDoc)
    );
    return playersArray;
  } else {
    return [];
  }
};

// get multiple tournaments:
export const getTournaments = async (tournamentsIdsArray) => {
  if (tournamentsIdsArray.length > 0) {
    const tournamentsQuery = query(
      getTournamentsColRef(),
      where(documentId(), 'in', tournamentsIdsArray)
    );
    const querySnapshot = await getDocs(tournamentsQuery);
    const tournamentsArray = querySnapshot.docs.map((tournamentDoc) =>
      createTournamentObjectFromFirestore(tournamentDoc)
    );
    return tournamentsArray;
  } else {
    return [];
  }
};

// get all matches from tournament:
export const getTournamentMatches = async (tournamentId) => {
  const querySnapshot = await getDocs(getTournamentMatchesColRef(tournamentId));
  const matchesArray = querySnapshot.docs.map((matchDoc) =>
    createMatchObjectFromFirestore(matchDoc)
  );
  return matchesArray;
};

// get all matches from multiple tournaments:
export const getMatchesFromTournaments = async (tournamentsIdsArray) => {
  if (tournamentsIdsArray.length > 0) {
    const matchesArrays = await Promise.all(
      tournamentsIdsArray.map((tournamentId) =>
        getTournamentMatches(tournamentId)
      )
    );
    const matchesArray = matchesArrays.flat();
    return matchesArray;
  }
};

// get teams:
export const getTeams = async (teamAPlayersIdsArray, teamBPlayersIdsArray) => {
  const teamsPlayersIdsArray = [teamAPlayersIdsArray, teamBPlayersIdsArray];
  const teamsPlayersArrays = await Promise.all(
    teamsPlayersIdsArray.map((teamPlayersIdsArray) =>
      getPlayers(teamPlayersIdsArray)
    )
  );
  const teams = {
    teamA: teamsPlayersArrays[0],
    teamB: teamsPlayersArrays[1],
  };
  return teams;
};

// LISTENERS
// add listener to matchDoc:
export const addMatchListener = (tournamentId, matchId, setUpdatedMatch) =>
  onSnapshot(
    getMatchDocRef(tournamentId, matchId),
    (matchDoc) => {
      const match = createMatchObjectFromFirestore(matchDoc);
      setUpdatedMatch(match);
    },
    (error) => console.log(error)
  );

// add listener to tournamentDoc:
export const addTournamentListener = (tournamentId, setUpdatedTournament) =>
  onSnapshot(
    getTournamentDocRef(tournamentId),
    (tournamentDoc) => {
      const tournament = createTournamentObjectFromFirestore(tournamentDoc);
      setUpdatedTournament(tournament);
    },
    (error) => console.log(error)
  );

// add listener to multiple tournamentDocs:
export const addMultipleTournamentsListener = (
  tournamentsIdsArray,
  setTournaments
) => {
  const tournamentsQuery = query(
    getTournamentsColRef(),
    where(documentId(), 'in', tournamentsIdsArray)
  );
  return onSnapshot(tournamentsQuery, (querySnapshot) => {
    const tournamentsArray = [];
    querySnapshot.forEach((tournamentDoc) => {
      tournamentsArray.push(createTournamentObjectFromFirestore(tournamentDoc));
    });
    setTournaments({
      all: tournamentsArray,
      active: tournamentsArray.filter((tournament) => tournament.isActive),
      finished: tournamentsArray.filter((tournament) => !tournament.isActive),
    });
  });
};

// SUBSCRIBERS
// subscribe user to tournament:
export const subscribeToTournament = async (tournamentId, userId) => {
  await updateDoc(getTournamentDocRef(tournamentId), {
    players: arrayUnion(userId),
  });
  await updateDoc(getPlayerDocRef(userId), {
    'tournaments.all': arrayUnion(tournamentId),
    'tournaments.active': arrayUnion(tournamentId),
  });
};

// unsubscribe user from tournament:
export const unsubscribeFromTournament = async (tournamentId, userId) => {
  await updateDoc(getTournamentDocRef(tournamentId), {
    players: arrayRemove(userId),
  });
  await updateDoc(getPlayerDocRef(userId), {
    'tournaments.all': arrayRemove(tournamentId),
    'tournaments.active': arrayRemove(tournamentId),
  });
  const tournament = await getTournament(tournamentId);
  if (tournament.players.length === 0)
    await deleteDoc(getTournamentDocRef(tournamentId));
};

// subscribe user to match:
// export const subscribeToMatch = async (tournamentId, matchId, userId) => {
//   await updateDoc(getMatchDocRef(tournamentId, matchId), {
//     players: arrayUnion({
//       id: userId,
//       subscriptionDateTime: currentDateTime,
//       subscribedBy: userId,
//     }),
//   });
// };
export const subscribeToMatch = async (tournamentId, matchId, userId) => {
  await updateDoc(getMatchDocRef(tournamentId, matchId), {
    players: arrayUnion(userId),
  });
};

// unsubscribe user from match:
// export const unsubscribeFromMatch = async (tournamentId, matchId, userId) => {
//   await updateDoc(getMatchDocRef(tournamentId, matchId), {
//     players: arrayRemove({ id: userId }),
//   });
// };
export const unsubscribeFromMatch = async (tournamentId, matchId, userId) => {
  await updateDoc(getMatchDocRef(tournamentId, matchId), {
    players: arrayRemove(userId),
  });
};

// COMPONENTS AND USED ACTIONS:

// AUTHCONTEXT
// create player profile object from user (first time sign up)
// get player profile (when user signs in)
// add listener to multiple tournamentDocs:

// HOME PAGE
// get matches from multiple tournaments

// TOURNAMENTS PAGE
// get tournaments

// TOURNAMENT DETAIL PAGE
// get tournament
// get matches from tournament

// TOURNAMENT DETAIL SECTION
// subscribe user to tournament
// unsubscribe user from tournament

// TOURNAMENT FORM
// add tournament
// edit tournament

// TOURNAMENT PLAYERS PAGE
// get tournament
// get players

// SOCCERFIELD CONTAINER
// add listener to matchDoc
// add listener to tournamentDoc
// get tournament
// get players
// get match teams

// PLAYER ICON CONTAINER
// subscribe user to match
// unsubscribe user from match

// CONTACTS PAGE
// get tournaments
// get players

// PLAYER FORM
// add non-verified player to tournament

// MATCH FORM
// get multiple players
