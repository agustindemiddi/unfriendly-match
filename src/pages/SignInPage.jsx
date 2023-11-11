import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleButton } from 'react-google-button';

import { getUserAuthCtx } from '../context/AuthContext';

const SignInPage = () => {
  const { googleSignIn, user } = getUserAuthCtx();
  const navigate = useNavigate();

  const googleSignInHandler = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    user?.displayName && navigate('/');
  }, [user]);

  return (
    <div>
      <h1>Sign In</h1>
      <div>
        <GoogleButton onClick={googleSignInHandler} />
      </div>
    </div>
  );
};

export default SignInPage;
