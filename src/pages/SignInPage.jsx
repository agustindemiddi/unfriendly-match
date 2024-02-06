import { Navigate } from 'react-router-dom';

import SignInSection from '../components/auth/SignInSection/SignInSection';

import { getUserAuthCtx } from '../context/authContext';

const SignInPage = () => {
  const { user, handleEmailLogin, handleGoogleLogin } = getUserAuthCtx();

  if (user) {
    return <Navigate to='/' />;
  } else {
    return (
      <>
        {handleEmailLogin && handleGoogleLogin && (
          <SignInSection
            handleEmailLogin={handleEmailLogin}
            handleGoogleLogin={handleGoogleLogin}
          />
        )}
      </>
    );
  }
};

export default SignInPage;
