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

import { NavLink } from 'react-router-dom';

import styles from './MainNavigation.module.css';

const MainNavigation = () => {
  return (
    <>
      <nav className={styles.mainNav}>
        <DribbbleOutlined />
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <HomeOutlined /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tournaments"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <SkinOutlined /> Tournaments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <GlobalOutlined /> Groups
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contacts"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <FileSearchOutlined /> Contacts
            </NavLink>
          </li>
        </ul>
        <div>
          <Button shape="round" icon={<LoginOutlined />}>
            Login
          </Button>
          <Button shape="round" icon={<LogoutOutlined />}>
            Logout
          </Button>
        </div>
      </nav>
    </>
  );
};

export default MainNavigation;
