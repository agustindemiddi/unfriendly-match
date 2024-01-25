import { Link } from 'react-router-dom';

import styles from './MatchItem.module.css';

import { getStringFormattedLongDateTime } from '../../../../../utils/getDates';

const MatchItem = ({ match }) => {
  return (
    <div style={{ border: '1px solid white' }}>
      <p>matchDateTime: {getStringFormattedLongDateTime(match.dateTime)}</p>
      <p>address: {match.address}</p>
      <p>
        matchSubscriptionDateTime:
        {getStringFormattedLongDateTime(match.subscriptionDateTime)}
      </p>
      {/* <p>players: {match.players[0] || 'no players subscribed to this match'}</p> */}
      <p>
        matchCreationDateTime:
        {getStringFormattedLongDateTime(match.creationDateTime)}
      </p>
      <Link to={`${match.id}`}>
        <button>Entrar</button>
      </Link>
    </div>
  );
};

export default MatchItem;
