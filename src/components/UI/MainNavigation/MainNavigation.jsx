import { NavLink, Link } from 'react-router-dom';
import { Button } from 'antd';
import {
  HomeOutlined,
  SkinOutlined,
  FileSearchOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import logo from '/logo.svg';
import UserIcon from '../../user/UserIcon/UserIcon';

import styles from './MainNavigation.module.css';

import { getUserAuthCtx } from '../../../context/authContext';

const sections = [
  { url: '/', icon: <HomeOutlined />, label: 'Home' },
  { url: '/tournaments', icon: <SkinOutlined />, label: 'Tournaments' },
  { url: '/contacts', icon: <FileSearchOutlined />, label: 'Contacts' },
];

const MainNavigation = () => {
  const { user, handleLogout } = getUserAuthCtx();

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
                  isActive ? styles.activeLink : ''
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
                onClick={handleLogout}
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
