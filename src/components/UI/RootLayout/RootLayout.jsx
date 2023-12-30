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
        <aside>
          <AsideNavigation />
        </aside>
        <Outlet />
      </main>
      <footer>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur.
      </footer>
    </>
  );
};

export default RootLayout;
