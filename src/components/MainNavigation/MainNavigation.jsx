import { NavLink, Link } from 'react-router-dom';
import { Button } from 'antd';
import {
  HomeOutlined,
  SkinOutlined,
  GlobalOutlined,
  FileSearchOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { getUserAuthCtx } from '../../context/AuthContext';
import logo from '../../assets/logo/logo.svg';

import styles from './MainNavigation.module.css';

const sections = [
  { url: '/', icon: <HomeOutlined />, label: 'Home' },
  { url: '/tournaments', icon: <SkinOutlined />, label: 'Tournaments' },
  { url: '/groups', icon: <GlobalOutlined />, label: 'Groups' },
  { url: '/contacts', icon: <FileSearchOutlined />, label: 'Contacts' },
];

const MainNavigation = () => {
  const { handleSignOut, user } = getUserAuthCtx();

  return (
    <>
      <nav className={styles.mainNav}>
        <Link to='/'>
          <img className={styles.logo} src={logo} alt='logo' />
        </Link>
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
          {user ? (
            <Button
              onClick={handleSignOut}
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
