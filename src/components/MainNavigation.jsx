import { Menu, Flex, Button } from 'antd';
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

const items = [
  {
    label: <a href="/">Home</a>,
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: <a href="/tournaments">Tournaments</a>,
    key: 'tournaments',
    icon: <SkinOutlined />,
  },
  {
    label: <a href="/groups">Groups</a>,
    key: 'groups',
    icon: <GlobalOutlined />,
  },
  {
    label: <a href="/contacts">Contacts</a>,
    key: 'contacts',
    icon: <FileSearchOutlined />,
  },
];

const MainNavigation = () => {
  return (
    <>
      <header>
        <nav className={styles.mainNav}>
          <Flex justify="space-between" align="center">
            <Flex>
              <DribbbleOutlined />
              <Menu mode="horizontal" items={items}></Menu>
            </Flex>
            <div>
              <Button shape="round" icon={<LoginOutlined />}>
                Login
              </Button>
              <Button shape="round" icon={<LogoutOutlined />}>
                Logout
              </Button>
            </div>
          </Flex>
        </nav>
      </header>
    </>
  );
};

export default MainNavigation;
