import { Link } from 'react-router-dom';

import styles from './MatchDetail.module.css';

import SoccerFieldContainer from '../SoccerField/SoccerFieldContainer';

const MatchDetail = ({ match }) => {
  return (
    <>
      <SoccerFieldContainer match={match} />
      <Link to='edit'>
        <button>editar PARTIDO</button>
      </Link>
    </>
  );
};

export default MatchDetail;
