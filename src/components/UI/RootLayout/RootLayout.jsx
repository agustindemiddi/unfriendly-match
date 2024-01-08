import { Outlet } from 'react-router-dom';

import MainNavigation from '../MainNavigation/MainNavigation';
import AsideNavigation from '../AsideNavigation/AsideNavigation';

const RootLayout = () => {
  return (
    <>
      <header>
        <MainNavigation />
      </header>
      <main>
        {/* <AsideNavigation /> */}
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
