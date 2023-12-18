import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './UserIcon.module.css';

import { getUserAuthCtx } from '../../../context/AuthContext';

const UserIcon = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (userPlayerProfile) setUser(userPlayerProfile);
  }, [userPlayerProfile]);

  return (
    <>
      {user && (
        <div className={styles.playerIconContainer}>
          <img
            className={styles.playerIcon}
            src={user.image}
            alt='User image'
          />
          <Link to={`/${user.id}`}>
            <span className={styles.hidden}>{user.username}</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default UserIcon;
