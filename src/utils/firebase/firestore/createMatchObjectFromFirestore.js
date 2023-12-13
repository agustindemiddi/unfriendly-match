const createMatchObjectFromFirestore = (match) => ({
  ...match.data(),
  id: match.id,
  creationDateTime: match.data().creationDateTime?.toDate(),
  registryDateTime: match.data().registryDateTime?.toDate(),
  dateTime: match.data().dateTime?.toDate(),
  // tournament: match.data().tournament,
  // creator: match.data().creator,
  // admins: match.data().admins,
  // address: match.data().address,
  // playerQuota: match.data().playerQuota,
  // players: match.data().players, // name playerList in future
  // teamA: match.data().teamA,
  // teamB: match.data().teamB,
  // result: match.data().result,
  // mvp: match.data().mvp,
});

export default createMatchObjectFromFirestore;
