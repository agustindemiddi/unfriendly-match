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
        <Link to={`/${user.id}`}>
          <div className={styles.playerIconContainer}>
            <img
              className={styles.playerIcon}
              src={user.image}
              alt='User image'
            />
          </div>
        </Link>
      )}
    </>
  );
};

export default UserIcon;
