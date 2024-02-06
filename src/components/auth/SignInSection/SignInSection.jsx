import { useState } from 'react';
import { GoogleButton } from 'react-google-button';

import Section from '../../UI/Section/Section';
import EmailForm from './EmailForm/EmailForm';

import styles from './SignInSection.module.css';

const SignInSection = ({ handleEmailLogin, handleGoogleLogin }) => {
  const [formModeIsSignIn, setFormModeIsSignIn] = useState(true);

  return (
    <Section>
      <div className={styles.signInContent}>
        <EmailForm
          formModeIsSignIn={formModeIsSignIn}
          setFormModeIsSignIn={setFormModeIsSignIn}
          handleEmailLogin={handleEmailLogin}
        />
        <p>or</p>
        <GoogleButton onClick={handleGoogleLogin} />
      </div>
    </Section>
  );
};

export default SignInSection;
