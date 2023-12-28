import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { GoogleButton } from 'react-google-button';

import Section from '../UI/Section';
import SignInForm from './SignInForm';

import styles from './SignIn.module.css';

import { getUserAuthCtx } from '../../context/AuthContext';

const SignIn = () => {
  const [formModeIsSignIn, setFormModeIsSignIn] = useState(true);
  const { user, handleGoogleSignIn } = getUserAuthCtx();

  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <Section>
      <div className={styles['sign-in']}>
        <div className={styles['form-modes']}>
          <div
            onClick={() => setFormModeIsSignIn(true)}
            className={`${styles['form-mode']} ${
              formModeIsSignIn ? styles.selectedFormMode : ''
            }`}>
            SIGN IN
          </div>
          <div
            onClick={() => setFormModeIsSignIn(false)}
            className={`${styles['form-mode']} ${
              !formModeIsSignIn ? styles.selectedFormMode : ''
            }`}>
            SIGN UP
          </div>
        </div>
        <SignInForm formModeIsSignIn={formModeIsSignIn} />
        <p className={styles.or}>or</p>
        <GoogleButton onClick={handleGoogleSignIn} />
      </div>
    </Section>
  );
};

export default SignIn;
