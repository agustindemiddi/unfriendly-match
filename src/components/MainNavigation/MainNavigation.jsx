import { NavLink } from 'react-router-dom';
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

import styles from './MainNavigation.module.css';

const sections = [
  { url: '/', icon: <HomeOutlined />, label: 'Home' },
  { url: '/tournaments', icon: <SkinOutlined />, label: 'Tournaments' },
  { url: '/groups', icon: <GlobalOutlined />, label: 'Groups' },
  { url: '/contacts', icon: <FileSearchOutlined />, label: 'Contacts' },
];

const MainNavigation = () => {
  return (
    <>
      <nav className={styles.mainNav}>
        <DribbbleOutlined />
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
          <Button shape='round' icon={<LoginOutlined />}>
            Login
          </Button>
          <Button shape='round' icon={<LogoutOutlined />}>
            Logout
          </Button>
        </div>
      </nav>
    </>
  );
};

export default MainNavigation;
