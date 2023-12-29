import { useRef } from 'react';

import styles from './SignInForm.module.css';

import { getUserAuthCtx } from '../../../../context/authContext';

const SignInForm = ({ formModeIsSignIn }) => {
  const emailInput = useRef();
  const passwordInput = useRef();
  const repeatPasswordInput = useRef();
  const { handleEmailSignIn } = getUserAuthCtx();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formModeIsSignIn) {
      if (passwordInput.current.value !== repeatPasswordInput.current.value)
        return;
    }
    handleEmailSignIn(
      formModeIsSignIn,
      emailInput.current.value,
      passwordInput.current.value,
    );
  };

  return (
    <form className={styles['sign-in-form']} onSubmit={handleSubmit}>
      <input type='email' placeholder='Your email' ref={emailInput} required />
      <input
        type='password'
        placeholder='Your password'
        ref={passwordInput}
        required
      />
      {!formModeIsSignIn && (
        <input
          type='password'
          placeholder='Repeat your password'
          ref={repeatPasswordInput}
          required
        />
      )}

      <button type='submit'>
        {formModeIsSignIn ? 'Sign In!' : 'Sign Up!'}
      </button>
    </form>
  );
};

export default SignInForm;
