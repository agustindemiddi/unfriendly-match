import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './UserIcon.module.css';

import { getUserAuthCtx } from '../../../context/authContext';

const UserIcon = () => {
  const { updatedUserPlayerProfile } = getUserAuthCtx();

  return (
    <Link to={updatedUserPlayerProfile && `/${updatedUserPlayerProfile.id}`}>
      <div className={styles.playerIconContainer}>
        <img
          className={styles.playerIcon}
          src={updatedUserPlayerProfile?.image || '/default-user.svg'}
          alt='User image'
        />
      </div>
    </Link>
  );
};

export default UserIcon;
