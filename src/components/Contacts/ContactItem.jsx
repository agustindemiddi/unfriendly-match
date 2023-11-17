import { Link } from 'react-router-dom';
import { Button } from 'antd';

const ContactItem = ({ item }) => {
  return (
    <>
      {item.name && (
        <>
          <h2>{item.name}</h2>
          <p>description: {item.description}</p>
          <img src={item.image} alt='' />
        </>
      )}
      {!item.name && (
        <>
          <p>Player not found!</p>
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

export default ContactItem;
