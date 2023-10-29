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
            <NavLink to="/">
              <HomeOutlined /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/tournaments">
              <SkinOutlined /> Tournaments
            </NavLink>
          </li>
          <li>
            <NavLink to="/groups">
              <GlobalOutlined /> Groups
            </NavLink>
          </li>
          <li>
            <NavLink to="/contacts">
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
