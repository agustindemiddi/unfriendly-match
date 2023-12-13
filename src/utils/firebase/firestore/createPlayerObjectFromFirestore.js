const createMatchPlayerObjectFromFirestore = (player) => ({
  id: player.id,
  username: player.data().username,
  image:
    player.data().image ?? '/default-image.svg',
});

export default createMatchPlayerObjectFromFirestore;
