import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleButton } from 'react-google-button';

import SignInForm from './SignInForm';

import styles from './SignIn.module.css';

import { getUserAuthCtx } from '../../context/AuthContext';

const SignIn = () => {
  const [formModeIsSignIn, setFormModeIsSignIn] = useState(true);
  const navigate = useNavigate();
  const { handleGoogleSignIn, user } = getUserAuthCtx();

  useEffect(() => {
    user && navigate('/');
  }, [user]);

  return (
    <div className={styles['sign-in']}>
      <div className={styles['form-modes']}>
        <div
          onClick={() => setFormModeIsSignIn(true)}
          className={`${styles['form-mode']} ${
            formModeIsSignIn ? styles.selectedFormMode : undefined
          }`}
        >
          SIGN IN
        </div>
        <div
          onClick={() => setFormModeIsSignIn(false)}
          className={`${styles['form-mode']} ${
            !formModeIsSignIn ? styles.selectedFormMode : undefined
          }`}
        >
          SIGN UP
        </div>
      </div>
      <SignInForm formModeIsSignIn={formModeIsSignIn} />
      <p className={styles.or}>or</p>
      <GoogleButton onClick={handleGoogleSignIn} />
    </div>
  );
};

export default SignIn;
