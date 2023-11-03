const TournamentItem = ({ item }) => {
  return (
    <>
      <p>tournamentId: {item.id}</p>
      <h2>{item.name}</h2>
      <img src={item.image} alt='' />
      <p>description: {item.description}</p>
      <p>players: ... in development</p>
    </>
  );
};
export default TournamentItem;
