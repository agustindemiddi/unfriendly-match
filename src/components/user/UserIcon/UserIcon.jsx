import { Link } from 'react-router-dom';

import styles from './UserIcon.module.css';

import { getUserAuthCtx } from '../../../context/authContext';

const UserIcon = () => {
  const { userPlayerProfile } = getUserAuthCtx();

  return (
    <Link to={userPlayerProfile && `/${userPlayerProfile.id}`}>
      <div className={styles.playerIconContainer}>
        <img
          className={styles.playerIcon}
          src={userPlayerProfile?.image || '/default-user.svg'}
          alt='User image'
        />
      </div>
    </Link>
  );
};

export default UserIcon;
