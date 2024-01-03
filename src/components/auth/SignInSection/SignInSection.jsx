import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { GoogleButton } from 'react-google-button';

import Section from '../../UI/Section/Section';
import EmailForm from './EmailForm/EmailForm';

import styles from './SignInSection.module.css';

import { getUserAuthCtx } from '../../../context/authContext';

const SignInSection = () => {
  const [formModeIsSignIn, setFormModeIsSignIn] = useState(true);
  const { user, handleGoogleSignIn } = getUserAuthCtx();

  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <Section noActionsBar>
      <div className={styles.signInContent}>
        <EmailForm
          formModeIsSignIn={formModeIsSignIn}
          setFormModeIsSignIn={setFormModeIsSignIn}
        />
        <p>or</p>
        <GoogleButton onClick={handleGoogleSignIn} />
      </div>
    </Section>
  );
};

export default SignInSection;
