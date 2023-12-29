import { Outlet } from 'react-router-dom';

import MainNavigation from '../MainNavigation/MainNavigation';

const RootLayout = () => {
  return (
    <>
      <header>
        <MainNavigation />
      </header>
      <main>
        <aside>SIDE NAV MENU</aside>
        <Outlet />
      </main>
      <footer>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur.
      </footer>
    </>
  );
};

export default RootLayout;
