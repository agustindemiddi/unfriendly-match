import { Link } from 'react-router-dom';
import { Button } from 'antd';

const TournamentItem = ({ item }) => {
  return (
    <>
      {item.name && (
        <>
          <h2>{item.name}</h2>
          <p>description: {item.description}</p>
          <img src={item.image} alt='' />
          <p>players: ... in development</p>
        </>
      )}
      {!item.name && (
        <>
          <p>Tournament not found!</p>
          <Button>
            <Link to='..' relative='path'>
              Volver
            </Link>
          </Button>
        </>
      )}
    </>
  );
};

export default TournamentItem;
