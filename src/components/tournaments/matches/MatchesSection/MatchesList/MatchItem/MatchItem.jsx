import { Link } from 'react-router-dom';

import styles from './MatchItem.module.css';

import formatDate from '../../../../../../utils/formatDate';

const MatchItem = ({ match }) => {
  return (
    <div style={{ border: '1px solid white' }}>
      <p>matchDateTime: {formatDate(match.dateTime)}</p>
      <p>address: {match.address}</p>
      <p>matchRegistryDateTime: {formatDate(match.registryDateTime)}</p>
      <p>admins: {match.admins[0]}</p>
      <p>players: {match.players[0]}</p>
      <p>matchCreationDateTime: {formatDate(match.creationDateTime)}</p>
      <Link to={`${match.id}`}>
        <button>Entrar</button>
      </Link>
    </div>
  );
};

export default MatchItem;
