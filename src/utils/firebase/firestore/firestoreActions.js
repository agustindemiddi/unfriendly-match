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
const createPlayerObjectFromUser = (id, displayName, profilePicture) => ({
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

const createPlayerObjectFromFirestore = (playerDoc) => {
  const playerData = {
    ...playerDoc.data(),
    id: playerDoc.id,
    creationDateTime: playerDoc.data()?.creationDateTime?.toDate(),
    image: playerDoc.data()?.image || '/default-user.svg',
  };
  if (playerDoc.data()?.mergeRequests?.length > 0) {
    playerData.mergeRequests = playerDoc
      .data()
      .mergeRequests.map((mergeRequest) => ({
        ...mergeRequest,
        requestDateTime: mergeRequest.requestDateTime.toDate(),
      }));
  }
  if (playerDoc.data()?.previousNonVerifiedPlayerProfiles?.length > 0) {
    playerData.previousNonVerifiedPlayerProfiles = playerDoc
      .data()
      .previousNonVerifiedPlayerProfiles.map(
        (previousNonVerifiedPlayerProfile) => ({
          ...previousNonVerifiedPlayerProfile,
          creationDateTime:
            previousNonVerifiedPlayerProfile.creationDateTime.toDate(),
          mergeDateTime:
            previousNonVerifiedPlayerProfile.mergeDateTime.toDate(),
        })
      );
  }
  return playerData;
};

const createTournamentObjectFromFirestore = (tournamentDoc) => ({
  ...tournamentDoc.data(),
  id: tournamentDoc.id,
  creationDateTime: tournamentDoc.data().creationDateTime?.toDate(),
  terminationDate: tournamentDoc.data().terminationDate?.toDate(),
});

const createMatchObjectFromFirestore = (matchDoc) => ({
  ...matchDoc.data(),
  id: matchDoc.id,
  creationDateTime: matchDoc.data().creationDateTime?.toDate(),
  subscriptionDateTime: matchDoc.data().subscriptionDateTime?.toDate(),
  dateTime: matchDoc.data().dateTime?.toDate(),
});

const createMatchPlayerObjectFromPlayer = (
  tournamentId,
  matchId,
  player,
  userId
) => ({
  displayName: player.displayName,
  username: player.username,
  image: player.image,
  isPublic: player.isPublic, // quizas innecesario

  matchSubscriptionDateTime: new Date(),
  matchSubscribedBy: userId,
  match: matchId, // quizas innecesario
  tournament: tournamentId, // quizas innecesario
});

const createMatchPlayerObjectFromFirestore = (matchPlayerDoc) => {
  return {
    ...matchPlayerDoc.data(),
    id: matchPlayerDoc.id,
    matchSubscriptionDateTime: matchPlayerDoc
      .data()
      .matchSubscriptionDateTime?.toDate(),
  };
};

const createMatchPlayerObjectFromMerge = (user, nonVerifiedMatchPlayer) => {
  return {
    displayName: user.displayName,
    username: user.username,
    image: user.image,
    isPublic: user.isPublic, // quizas innecesario

    matchSubscriptionDateTime: nonVerifiedMatchPlayer.matchSubscriptionDateTime,
    matchSubscribedBy: nonVerifiedMatchPlayer.matchSubscribedBy,
    match: nonVerifiedMatchPlayer.match, // quizas innecesario
    tournament: nonVerifiedMatchPlayer.tournament, // quizas innecesario
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
// check and add player:
export const checkAndAddPlayer = async (currentUser) => {
  const { uid } = currentUser;
  const playerDoc = await getDoc(getPlayerDocRef(uid));
  if (!playerDoc.exists()) {
    const signInMethod = currentUser.providerData[0].providerId;
    if (signInMethod === 'google.com') {
      const { displayName, photoURL } = currentUser;
      const playerData = createPlayerObjectFromUser(uid, displayName, photoURL);
      await setDoc(getPlayerDocRef(uid), playerData);
    } else if (signInMethod === 'password') {
      const displayName = currentUser.email.split('@')[0];
      const playerData = createPlayerObjectFromUser(uid, displayName);
      await setDoc(getPlayerDocRef(uid), playerData);
    }
  }
};

// get player:
export const getPlayer = async (playerId) => {
  const playerDoc = await getDocument(getPlayerDocRef(playerId));
  const player = createPlayerObjectFromFirestore(playerDoc);
  return player;
};

// edit player:
const editPlayer = async (playerId, playerData) =>
  await updateDoc(getPlayerDocRef(playerId), playerData);

// get tournament:
export const getTournament = async (tournamentId) => {
  const tournamentDoc = await getDocument(getTournamentDocRef(tournamentId));
  const tournament = createTournamentObjectFromFirestore(tournamentDoc);
  return tournament;
};

// add tournament:
export const addTournament = async (userId, tournamentData, tournamentId) => {
  await setDoc(getTournamentDocRef(tournamentId), tournamentData);

  await updateDoc(getPlayerDocRef(userId), {
    'tournaments.all': arrayUnion(tournamentId),
    'tournaments.active': arrayUnion(tournamentId),
  });
};

// edit tournament:
export const editTournament = async (tournamentId, tournamentData) =>
  await updateDoc(getTournamentDocRef(tournamentId), tournamentData);

// add non-verified player:
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
  await updateDoc(getTournamentDocRef(tournamentId), {
    'matches': arrayUnion(matchId),
  });
};

// edit match:
export const editMatch = async (tournamentId, matchId, matchData) =>
  await updateDoc(getMatchDocRef(tournamentId, matchId), matchData);

// get match player:
export const getMatchPlayer = async (tournamentId, matchId, playerId) => {
  const matchPlayerDoc = await getDocument(
    getMatchPlayerDocRef(tournamentId, matchId, playerId)
  );
  const matchPlayer = createMatchPlayerObjectFromFirestore(matchPlayerDoc);
  return matchPlayer;
};

// add match player:
export const addMatchPlayer = async (tournamentId, matchId, player, userId) => {
  const playerData = createMatchPlayerObjectFromPlayer(
    tournamentId,
    matchId,
    player,
    userId
  );
  await setDoc(
    getMatchPlayerDocRef(tournamentId, matchId, player.id),
    playerData
  );
};

// delete match player:
export const deleteMatchPlayer = async (tournamentId, matchId, playerId) => {
  await deleteDoc(getMatchPlayerDocRef(tournamentId, matchId, playerId));
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
    createMatchPlayerObjectFromFirestore(playerdDoc)
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
// add listener to playerDoc:
export const addPlayerListener = (playerId, setUpdatedUserProfile) =>
  onSnapshot(
    getPlayerDocRef(playerId),
    (playerDoc) => {
      const player = createPlayerObjectFromFirestore(playerDoc);
      setUpdatedUserProfile(player);
    },
    (error) => console.log(error)
  );

// add listener to multiple playersDocs:
export const addMultiplePlayersListener = (
  playersIdsArray,
  setUpdatedPlayers
) => {
  const playersQuery = query(
    getPlayersColRef(),
    where(documentId(), 'in', playersIdsArray)
  );
  return onSnapshot(playersQuery, (querySnapshot) => {
    const playersArray = [];
    querySnapshot.forEach((playerDoc) => {
      playersArray.push(createPlayerObjectFromFirestore(playerDoc));
    });
    setUpdatedPlayers(playersArray);
  });
};

// add listener to tournamentDoc:
const addTournamentListener = (tournamentId, setUpdatedTournament) =>
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
  setUpdatedTournaments
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
    setUpdatedTournaments({
      all: tournamentsArray,
      active: tournamentsArray.filter((tournament) => tournament.isActive),
      finished: tournamentsArray.filter((tournament) => !tournament.isActive),
    });
  });
};

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

// add listener to multiple matchesDocs:
export const addMultipleMatchesListener = (
  tournamentId,
  MatchesIdsArray,
  setUpdatedMatches
) => {
  const matchesQuery = query(
    getTournamentMatchesColRef(tournamentId),
    where(documentId(), 'in', MatchesIdsArray)
  );
  return onSnapshot(matchesQuery, (querySnapshot) => {
    const matchesArray = [];
    querySnapshot.forEach((matchDoc) => {
      matchesArray.push(createMatchObjectFromFirestore(matchDoc));
    });
    setUpdatedMatches(matchesArray);
  });
};

// add listener to multiple matchPlayersDocs:
export const addMultipleMatchPlayersListener = (
  tournamentId,
  matchId,
  MatchPlayersIdsArray,
  setUpdatedMatchPlayers
) => {
  if (MatchPlayersIdsArray.length > 0) {
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
  } else {
    setUpdatedMatchPlayers([]);
  }
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
    'tournaments.finished': arrayRemove(tournamentId),
  });
};

// delete tournament:
export const deleteTournament = async (tournamentId, userId, playersIds) => {
  await updateDoc(getPlayerDocRef(userId), {
    'tournaments.all': arrayRemove(tournamentId),
    'tournaments.active': arrayRemove(tournamentId),
    'tournaments.finished': arrayRemove(tournamentId),
  });
  playersIds.forEach(
    async (playerId) =>
      await updateDoc(getPlayerDocRef(playerId), {
        'tournaments.all': arrayRemove(tournamentId),
        'tournaments.active': arrayRemove(tournamentId),
        'tournaments.finished': arrayRemove(tournamentId),
      })
  );
  const matches = await getTournamentMatches(tournamentId);
  matches.forEach(async (match) => {
    const matchPlayers = await getMatchPlayers(tournamentId, match.id);
    matchPlayers.forEach(
      async (player) =>
        await deleteDoc(getMatchPlayerDocRef(tournamentId, match.id, player.id))
    );
    await deleteDoc(getMatchDocRef(tournamentId, match.id));
  });
  await deleteDoc(getTournamentDocRef(tournamentId));
};

// subscribe user to match:
export const subscribeToMatch = async (
  tournamentId,
  matchId,
  player,
  userId
) => {
  await addMatchPlayer(tournamentId, matchId, player, userId);
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
// request merge:
export const requestMerge = async (
  verifiedPlayer,
  nonVerifiedPlayer,
  tournamentId
) => {
  if (
    nonVerifiedPlayer.mergeRequests?.some(
      (mergeRequest) => mergeRequest.requestedBy === verifiedPlayer.id
    )
  ) {
    alert('Request already done! Wait for an admin to approve or reject it!');
  } else {
    const nonVerifiedPlayerData = {
      ...nonVerifiedPlayer,
      mergeRequests: [
        {
          requestDateTime: new Date(),
          requestedBy: verifiedPlayer.id,
          tournament: tournamentId,
          status: 'pending',
        },
        ...(nonVerifiedPlayer.mergeRequests || []),
      ],
    };
    await editPlayer(nonVerifiedPlayer.id, nonVerifiedPlayerData);
    alert(
      'Merge request done successfully! Wait for an admin to approve (or reject) it!'
    );
  }
};

// cancel merge request:
export const cancelMergeRequest = async (verifiedPlayer, nonVerifiedPlayer) => {
  const request = nonVerifiedPlayer.mergeRequests?.find(
    (mergeRequest) => mergeRequest.requestedBy === verifiedPlayer.id
  );
  await updateDoc(getPlayerDocRef(nonVerifiedPlayer.id), {
    'mergeRequests': arrayRemove(request),
  });
  alert('Request cancelled!');
};

// decline merge request (admin):
export const declineMergeRequest = async (
  verifiedPlayer,
  nonVerifiedPlayer
) => {
  const request = nonVerifiedPlayer.mergeRequests?.find(
    (mergeRequest) => mergeRequest.requestedBy.id === verifiedPlayer.id
  );
  const declinedRequest = {
    ...request,
    requestedBy: request.requestedBy.id,
  };
  await updateDoc(getPlayerDocRef(nonVerifiedPlayer.id), {
    'mergeRequests': arrayRemove(declinedRequest),
  });
  alert('Request cancelled!');
};

// merge non-verified player into verifiedPlayer:
export const mergePlayers = async (
  verifiedPlayer,
  nonVerifiedPlayer,
  adminId
) => {
  if (verifiedPlayer.isVerified && !nonVerifiedPlayer.isVerified) {
    try {
      let matchesWithConflict = [];

      await Promise.all(
        nonVerifiedPlayer.tournaments.all.map(async (tournamentId) => {
          const tournamentMatches = await getTournamentMatches(tournamentId);
          await Promise.all(
            tournamentMatches.map(async (match) => {
              const hasConflict = [
                verifiedPlayer.id,
                nonVerifiedPlayer.id,
              ].every((playerId) => match?.players?.includes(playerId));
              if (hasConflict) {
                matchesWithConflict.push(match);
              }

              if (
                !hasConflict &&
                match?.players?.includes(nonVerifiedPlayer.id)
              ) {
                const nonVerifiedMatchPlayer = await getMatchPlayer(
                  match.tournament,
                  match.id,
                  nonVerifiedPlayer.id
                );
                const mergedMatchPlayer = createMatchPlayerObjectFromMerge(
                  verifiedPlayer,
                  nonVerifiedMatchPlayer
                );
                await deleteDoc(
                  getMatchPlayerDocRef(
                    match.tournament,
                    match.id,
                    nonVerifiedPlayer.id
                  )
                );
                await setDoc(
                  getMatchPlayerDocRef(
                    match.tournament,
                    match.id,
                    verifiedPlayer.id
                  ),
                  mergedMatchPlayer
                );
                await updateDoc(getMatchDocRef(match.tournament, match.id), {
                  players: arrayRemove(nonVerifiedPlayer.id),
                });
                await updateDoc(getMatchDocRef(match.tournament, match.id), {
                  players: arrayUnion(verifiedPlayer.id),
                });
              }

              if (!hasConflict && match.teamA.includes(nonVerifiedPlayer.id)) {
                await updateDoc(getMatchDocRef(match.tournament, match.id), {
                  teamA: arrayRemove(nonVerifiedPlayer.id),
                });
                await updateDoc(getMatchDocRef(match.tournament, match.id), {
                  teamA: arrayUnion(verifiedPlayer.id),
                });
              }

              if (!hasConflict && match.teamB.includes(nonVerifiedPlayer.id)) {
                await updateDoc(getMatchDocRef(match.tournament, match.id), {
                  teamB: arrayRemove(nonVerifiedPlayer.id),
                });
                await updateDoc(getMatchDocRef(match.tournament, match.id), {
                  teamB: arrayUnion(verifiedPlayer.id),
                });
              }
            })
          );

          if (matchesWithConflict.length === 0) {
            await updateDoc(getTournamentDocRef(tournamentId), {
              players: arrayRemove(nonVerifiedPlayer.id),
            });
            await updateDoc(getTournamentDocRef(tournamentId), {
              players: arrayUnion(verifiedPlayer.id),
            });
          }
        })
      );

      if (matchesWithConflict.length === 0) {
        const mergedUser = {
          ...verifiedPlayer,
          tournaments: {
            all: Array.from(
              new Set([
                ...verifiedPlayer.tournaments.all,
                ...nonVerifiedPlayer.tournaments.all,
              ])
            ),
            active: Array.from(
              new Set([
                ...verifiedPlayer.tournaments.active,
                ...nonVerifiedPlayer.tournaments.active,
              ])
            ),
            finished: Array.from(
              new Set([
                ...verifiedPlayer.tournaments.finished,
                ...nonVerifiedPlayer.tournaments.finished,
              ])
            ),
          },
          previousNonVerifiedPlayerProfiles: [
            {
              creationDateTime: nonVerifiedPlayer.creationDateTime,
              createdBy: nonVerifiedPlayer.createdBy,
              mergeDateTime: new Date(),
              mergeApprovedBy: adminId,
            },
            ...(verifiedPlayer.previousNonVerifiedPlayerProfiles || []),
          ],
        };

        await updateDoc(getPlayerDocRef(verifiedPlayer.id), {
          'tournaments.all': mergedUser.tournaments.all,
          'tournaments.active': mergedUser.tournaments.active,
          'tournaments.finished': mergedUser.tournaments.finished,
          'previousNonVerifiedPlayerProfiles':
            mergedUser.previousNonVerifiedPlayerProfiles,
        });
        await deleteDoc(getPlayerDocRef(nonVerifiedPlayer.id));

        console.log('Merge successful!');
        console.log('mergedUser:', mergedUser);
      } else {
        console.log(
          'Conflict found, merge prevented: both players participate in the same match in at least one case.'
        );
        return matchesWithConflict;
      }
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
