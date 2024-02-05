import { Navigate } from 'react-router-dom';

import SignInSection from '../components/auth/SignInSection/SignInSection';

import { getUserAuthCtx } from '../context/authContext';

const SignInPage = () => {
  const { user, handleGoogleSignIn } = getUserAuthCtx();

  if (user) {
    return <Navigate to='/' />;
  } else {
    return (
      <>
        {handleGoogleSignIn && (
          <SignInSection handleGoogleSignIn={handleGoogleSignIn} />
        )}
      </>
    );
  }
};

export default SignInPage;
