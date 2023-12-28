import { NavLink, Link } from 'react-router-dom';
import { Button } from 'antd';
import {
  HomeOutlined,
  SkinOutlined,
  FileSearchOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { getUserAuthCtx } from '../../context/authContext';

import logo from '/logo.svg';
import UserIcon from '../user/UserIcon/UserIcon';

import styles from './MainNavigation.module.css';

const sections = [
  { url: '/', icon: <HomeOutlined />, label: 'Home' },
  { url: '/tournaments', icon: <SkinOutlined />, label: 'Tournaments' },
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
        <ul>
          {sections.map((section) => (
            <li key={section.label}>
              <NavLink
                to={section.url}
                className={({ isActive }) =>
                  isActive ? styles.activeLink : undefined
                }>
                {section.icon} {section.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <>
          {user ? (
            <div className={styles.user}>
              <Button
                onClick={handleSignOut}
                shape='round'
                icon={<LogoutOutlined />}>
                Sign out
              </Button>
              <UserIcon />
            </div>
          ) : (
            <Button shape='round' icon={<LoginOutlined />}>
              <Link to='/signin'>Sign in</Link>
            </Button>
          )}
        </>
      </nav>
    </>
  );
};

export default MainNavigation;
