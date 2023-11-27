import { Link } from 'react-router-dom';

import styles from './MatchDetail.module.css';

const MatchDetail = () => {
  return (
    <>
      <div>MatchDetailsPage</div>
      <Link to='edit'>
        <button>editar PARTIDO</button>
      </Link>
    </>
  );
};

export default MatchDetail;
