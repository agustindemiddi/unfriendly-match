import { Outlet } from 'react-router-dom';

import MainNavigation from '../MainNavigation/MainNavigation';
import AsideNavigation from '../AsideNavigation/AsideNavigation';

import { getUserAuthCtx } from '../../../context/authContext';

const RootLayout = () => {
  const { user, handleSignOut } = getUserAuthCtx();

  return (
    <>
      <header>
        {user && handleSignOut && (
          <MainNavigation user={user} handleSignOut={handleSignOut} />
        )}
      </header>
      <main>
        <AsideNavigation />
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
