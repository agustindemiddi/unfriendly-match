import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './UserIcon.module.css';

import { getUserAuthCtx } from '../../../context/authContext';

const UserIcon = () => {
  const { userPlayerProfile } = getUserAuthCtx();
  const [user, setUser] = useState({});

  // in SoccerFieldContainer.jsx I obtain the userPlayerProfile data immediately. Why?
  useEffect(() => {
    if (userPlayerProfile) setUser(userPlayerProfile);
  }, [userPlayerProfile]);

  return (
    <Link to={user && `/${user.id}`}>
      <div className={styles.playerIconContainer}>
        <img
          className={styles.playerIcon}
          // with loading status I won't need the default-user.svg fallback => src={user.image}
          src={user?.image || '/default-user.svg'}
          alt='User image'
        />
      </div>
    </Link>
  );
};

export default UserIcon;
