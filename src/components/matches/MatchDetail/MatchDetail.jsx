import { Link } from 'react-router-dom';

import styles from './MatchDetail.module.css';

import SoccerField from '../SoccerField/SoccerField';

const MatchDetail = ({ match }) => {
  return (
    <>
      <SoccerField match={match} />
      <Link to='edit'>
        <button>editar PARTIDO</button>
      </Link>
    </>
  );
};

export default MatchDetail;
