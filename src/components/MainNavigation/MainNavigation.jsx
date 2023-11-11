import { NavLink, Link } from 'react-router-dom';
import { Button } from 'antd';
import {
  HomeOutlined,
  SkinOutlined,
  GlobalOutlined,
  FileSearchOutlined,
  DribbbleOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { getUserAuthCtx } from '../../context/AuthContext';

import styles from './MainNavigation.module.css';

const sections = [
  { url: '/', icon: <HomeOutlined />, label: 'Home' },
  { url: '/tournaments', icon: <SkinOutlined />, label: 'Tournaments' },
  { url: '/groups', icon: <GlobalOutlined />, label: 'Groups' },
  { url: '/contacts', icon: <FileSearchOutlined />, label: 'Contacts' },
];

const MainNavigation = () => {
  const { googleSignOut, user } = getUserAuthCtx();

  const signOutHandler = async () => {
    try {
      await googleSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className={styles.mainNav}>
        <DribbbleOutlined />
        {/* {user && <span>{user.displayName}</span>} */}
        <ul>
          {sections.map((section) => (
            <li key={section.label}>
              <NavLink
                to={section.url}
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                {section.icon} {section.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div>
          {user?.displayName ? (
            <Button
              onClick={signOutHandler}
              shape='round'
              icon={<LogoutOutlined />}
            >
              Sign out
            </Button>
          ) : (
            <Button shape='round' icon={<LoginOutlined />}>
              <Link to='/signin'>Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
    </>
  );
};

export default MainNavigation;
