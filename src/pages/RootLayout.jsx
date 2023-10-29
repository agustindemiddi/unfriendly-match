import { Outlet } from 'react-router-dom';

import Hero from '../components/Hero';
import MainNavigation from '../components/MainNavigation/MainNavigation';

const RootLayout = () => {
  return (
    <Hero>
      <header>
        <MainNavigation />
      </header>
      <main>
        <Outlet />
      </main>
    </Hero>
  );
};

export default RootLayout;
