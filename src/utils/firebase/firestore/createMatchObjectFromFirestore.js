const createMatchObjectFromFirestore = (matchDoc) => ({
  ...matchDoc.data(),
  id: matchDoc.id,
  creationDateTime: matchDoc.data().creationDateTime?.toDate(),
  registryDateTime: matchDoc.data().registryDateTime?.toDate(),
  dateTime: matchDoc.data().dateTime?.toDate(),
  // tournament: matchDoc.data().tournament,
  // creator: matchDoc.data().creator,
  // admins: matchDoc.data().admins,
  // address: matchDoc.data().address,
  // playerQuota: matchDoc.data().playerQuota,
  // players: matchDoc.data().players, // name playerList in future
  // teamA: matchDoc.data().teamA,
  // teamB: matchDoc.data().teamB,
  // result: matchDoc.data().result,
  // mvp: matchDoc.data().mvp,
});

export default createMatchObjectFromFirestore;
