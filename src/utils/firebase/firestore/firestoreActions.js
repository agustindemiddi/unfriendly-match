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

// DOCUMENTS AND COLLECTIONS REFERENCES
const getPlayerDocRef = (playerId) => doc(db, `players/${playerId}`);

const getTournamentDocRef = (tournamentId) =>
  doc(db, `tournaments/${tournamentId}`);

const getMatchDocRef = (tournamentId, matchId) =>
  doc(db, `tournaments/${tournamentId}/matches/${matchId}`);

const getMatchPlayerDocRef = (tournamentId, matchId, playerId) =>
  doc(db, `tournaments/${tournamentId}/matches/${matchId}/players/${playerId}`);

const getPlayersColRef = () => collection(db, 'players');

const getTournamentsColRef = () => collection(db, 'tournaments');

const getTournamentMatchesColRef = (tournamentId) =>
  collection(db, `tournaments/${tournamentId}/matches`);

const getMatchPlayersColRef = (tournamentId, matchId) =>
  collection(db, `tournaments/${tournamentId}/matches/${matchId}/players`);

// OBJECT CREATION
export const createPlayerObjectFromFirestore = (playerDoc) => {
  const playerData = {
    ...playerDoc.data(),
    id: playerDoc.id,
    creationDateTime: playerDoc.data().creationDateTime?.toDate(),
    image: playerDoc.data()?.image || '/default-user.svg',
  };
  if (playerDoc.data().matchSubscriptionDateTime) {
    playerData.matchSubscriptionDateTime = playerDoc
      .data()
      .matchSubscriptionDateTime.toDate();
  }
  if (playerDoc.data().previousNonVerifiedPlayerProfile) {
    playerData.previousNonVerifiedPlayerProfile = {
      ...playerDoc.data().previousNonVerifiedPlayerProfile,
      creationDateTime: playerDoc.data().creationDateTime?.toDate(),
    };
  }
  return playerData;
};

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

const createMatchPlayerObjectFromPlayer = (matchId, player) => ({
  // id: player.id,
  displayName: player.displayName,
  username: player.username,
  image: player.image,
  // isPublic: player.isPublic,
  // isVerified: player.isVerified,

  matchSubscriptionDateTime: new Date(),
  matchSubscribedBy: player.id,
  match: matchId, // quizas innecesario
});

export const createMatchPlayerObjectFromFirestore = (matchPlayerDoc) => {
  return {
    ...matchPlayerDoc.data(),
    id: matchPlayerDoc.id,
    matchSubscriptionDateTime: matchPlayerDoc
      .data()
      .matchSubscriptionDateTime?.toDate(),
  };
};

const createMatchPlayerObjectFromMerge = (
  matchId,
  user,
  nonVerifiedMatchPlayer
) => {
  return {
    // id: user.id,
    displayName: user.displayName,
    username: user.username,
    image: user.image,
    // isPublic: user.isPublic,
    // isVerified: user.isVerified,

    matchSubscriptionDateTime: nonVerifiedMatchPlayer.matchSubscriptionDateTime,
    matchSubscribedBy: nonVerifiedMatchPlayer.matchSubscribedBy,
    match: matchId, // quizas innecesario
  };
};

const createMatchPlayerObjectFromMergeFallback = (matchId, user) => {
  return {
    // id: user.id,
    displayName: user.displayName,
    username: user.username,
    image: user.image,
    // isPublic: user.isPublic,
    // isVerified: user.isVerified,

    matchSubscriptionDateTime: new Date(),
    matchSubscribedBy: user.id,
    match: matchId, // quizas innecesario
  };
};

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
  creationDateTime: new Date(),
  isVerified: true,
  isPublic: false,
  displayName: displayName,
  username: `${displayName}_${id}`,
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

// create non-verified player and add to tournament:
export const addNonVerifiedPlayerToTournament = async (
  tournamentId,
  playerId,
  playerData
) => {
  await setDoc(getPlayerDocRef(playerId), playerData);

  await updateDoc(getTournamentDocRef(tournamentId), {
    players: arrayUnion(playerId),
  });
};

// get match:
export const getMatch = async (tournamentId, matchId) => {
  const matchDoc = await getDocument(getMatchDocRef(tournamentId, matchId));
  const match = createMatchObjectFromFirestore(matchDoc);
  return match;
};

// add match:
export const addMatch = async (tournamentId, matchId, matchData) => {
  await setDoc(getMatchDocRef(tournamentId, matchId), matchData);
};

// get match player:
export const getMatchPlayer = async (tournamentId, matchId, playerId) => {
  const matchPlayerDoc = await getDocument(
    getMatchPlayerDocRef(tournamentId, matchId, playerId)
  );
  const matchPlayer = createMatchPlayerObjectFromFirestore(matchPlayerDoc);
  return matchPlayer;
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

// get all players from match:
export const getMatchPlayers = async (tournamentId, matchId) => {
  const querySnapshot = await getDocs(
    getMatchPlayersColRef(tournamentId, matchId)
  );
  const playersArray = querySnapshot.docs.map((playerdDoc) =>
    createPlayerObjectFromFirestore(playerdDoc)
  );
  return playersArray;
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
const addMatchListener = (tournamentId, matchId, setUpdatedMatch) =>
  onSnapshot(
    getMatchDocRef(tournamentId, matchId),
    (matchDoc) => {
      const match = createMatchObjectFromFirestore(matchDoc);
      setUpdatedMatch(match);
    },
    (error) => console.log(error)
  );

// add listener to multiple matchPlayersDocs:
export const addMultipleMatchPlayersListener = (
  tournamentId,
  matchId,
  MatchPlayersIdsArray,
  setUpdatedMatchPlayers
) => {
  const matchPlayersQuery = query(
    getMatchPlayersColRef(tournamentId, matchId),
    where(documentId(), 'in', MatchPlayersIdsArray)
  );
  return onSnapshot(matchPlayersQuery, (querySnapshot) => {
    const matchPlayersArray = [];
    querySnapshot.forEach((matchPlayerDoc) => {
      matchPlayersArray.push(createPlayerObjectFromFirestore(matchPlayerDoc));
    });
    setUpdatedMatchPlayers(matchPlayersArray);
  });
};

// add listener to tournamentDoc: // estoy escuchando a un tournament especifico y tambien a todos. chequear si puedo obviar este listener
export const addTournamentListener = (tournamentId, setUpdatedTournament) =>
  onSnapshot(
    getTournamentDocRef(tournamentId),
    (tournamentDoc) => {
      const tournament = createTournamentObjectFromFirestore(tournamentDoc);
      setUpdatedTournament(tournament);
    },
    (error) => console.log(error)
  );

// add listener to multiple tournamentsDocs:
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
  // if last player unsubscribes from tournament, delete tournament:
  const tournament = await getTournament(tournamentId);
  if (tournament.players.length === 0)
    await deleteDoc(getTournamentDocRef(tournamentId));
};

// subscribe user to match:
export const subscribeToMatch = async (tournamentId, matchId, player) => {
  const playerData = createMatchPlayerObjectFromPlayer(matchId, player);
  await setDoc(
    getMatchPlayerDocRef(tournamentId, matchId, player.id),
    playerData
  );
  await updateDoc(getMatchDocRef(tournamentId, matchId), {
    players: arrayUnion(player.id),
  });
};

// unsubscribe user from match:
export const unsubscribeFromMatch = async (tournamentId, matchId, playerId) => {
  await deleteDoc(getMatchPlayerDocRef(tournamentId, matchId, playerId));
  await updateDoc(getMatchDocRef(tournamentId, matchId), {
    players: arrayRemove(playerId),
  });
};

// MERGING
// merge non-verified player into user
export const mergePlayers = async (user, nonVerifiedPlayer) => {
  if (user.isVerified && !nonVerifiedPlayer.isVerified) {
    try {
      await Promise.all(
        nonVerifiedPlayer.tournaments.all.map(async (tournamentId) => {
          updateDoc(getTournamentDocRef(tournamentId), {
            players: arrayRemove(nonVerifiedPlayer.id),
          });
          updateDoc(getTournamentDocRef(tournamentId), {
            players: arrayUnion(user.id),
          });

          const tournamentMatches = await getTournamentMatches(tournamentId);
          await Promise.all(
            tournamentMatches.map(async (match) => {
              if (match?.players?.includes(nonVerifiedPlayer.id)) {
                const nonVerifiedMatchPlayer = await getMatchPlayer(
                  match.tournament,
                  match.id,
                  nonVerifiedPlayer.id
                );

                const userMatchPlayer = nonVerifiedMatchPlayer
                  ? createMatchPlayerObjectFromMerge(
                      match.id,
                      user,
                      nonVerifiedMatchPlayer
                    )
                  : createMatchPlayerObjectFromMergeFallback(match.id, user);

                deleteDoc(
                  getMatchPlayerDocRef(
                    match.tournament,
                    match.id,
                    nonVerifiedPlayer.id
                  )
                );
                setDoc(
                  getMatchPlayerDocRef(match.tournament, match.id, user.id),
                  userMatchPlayer
                );

                updateDoc(getMatchDocRef(match.tournament, match.id), {
                  players: arrayRemove(nonVerifiedPlayer.id),
                });
                updateDoc(getMatchDocRef(match.tournament, match.id), {
                  players: arrayUnion(user.id),
                });
              }

              if (match.teamA.includes(nonVerifiedPlayer.id)) {
                updateDoc(getMatchDocRef(match.tournament, match.id), {
                  teamA: arrayRemove(nonVerifiedPlayer.id),
                });
                updateDoc(getMatchDocRef(match.tournament, match.id), {
                  teamA: arrayUnion(user.id),
                });
              }

              if (match.teamB.includes(nonVerifiedPlayer.id)) {
                updateDoc(getMatchDocRef(match.tournament, match.id), {
                  teamB: arrayRemove(nonVerifiedPlayer.id),
                });
                updateDoc(getMatchDocRef(match.tournament, match.id), {
                  teamB: arrayUnion(user.id),
                });
              }
            })
          );
        })
      );

      const mergedUser = {
        ...user,
        tournaments: {
          all: Array.from(
            new Set([
              ...user.tournaments.all,
              ...nonVerifiedPlayer.tournaments.all,
            ])
          ),
          active: Array.from(
            new Set([
              ...user.tournaments.active,
              ...nonVerifiedPlayer.tournaments.active,
            ])
          ),
          finished: Array.from(
            new Set([
              ...user.tournaments.finished,
              ...nonVerifiedPlayer.tournaments.finished,
            ])
          ),
        },
        previousNonVerifiedPlayerProfile: {
          id: nonVerifiedPlayer.id,
          creationDateTime: nonVerifiedPlayer.creationDateTime,
          createdBy: nonVerifiedPlayer.createdBy,
        },
      };

      await updateDoc(getPlayerDocRef(user.id), {
        'tournaments.all': mergedUser.tournaments.all,
        'tournaments.active': mergedUser.tournaments.active,
        'tournaments.finished': mergedUser.tournaments.finished,
        'previousNonVerifiedPlayerProfile.id':
          mergedUser.previousNonVerifiedPlayerProfile.id,
        'previousNonVerifiedPlayerProfile.creationDateTime':
          mergedUser.previousNonVerifiedPlayerProfile.creationDateTime,
        'previousNonVerifiedPlayerProfile.createdBy':
          mergedUser.previousNonVerifiedPlayerProfile.createdBy,
      });
      deleteDoc(getPlayerDocRef(nonVerifiedPlayer.id));

      console.log('MERGE SUCCESSFUL!');
    } catch (error) {
      console.log('error:', error);
      console.log('error.message:', error.message);
    }
  }
};

// COMPONENTS AND USED ACTIONS:

// FIREBASE AUTH ACTIONS
// get player profile (when user signs in)

// AUTH CONTEXT
// add listener to multiple tournamentsDocs
// get all matches from tournament

// HOME PAGE
// get all matches from multiple tournaments

// TOURNAMENT DETAIL PAGE
// get tournament (as fallback if user is not subscribed)

// TOURNAMENT DETAIL SECTION
// subscribe user to tournament
// unsubscribe user from tournament

// TOURNAMENT FORM
// add tournament
// edit tournament

// TOURNAMENT PLAYERS PAGE
// get tournament (as fallback if user is not subscribed)
// get multiple players

// SOCCERFIELD CONTAINER
// get all players from match
// add listener to multiple matchPlayersDocs
// get teams

// PLAYER ICON CONTAINER
// subscribe user to match
// unsubscribe user from match

// CONTACTS PAGE
// get multiple players

// PLAYER FORM
// create non-verified player and add to tournament

// MATCH FORM
// get multiple players
// add match
// subscribe user to match

// STANDINGS TABLE
// get multiple players
