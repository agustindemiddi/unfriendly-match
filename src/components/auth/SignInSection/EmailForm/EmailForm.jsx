import { useRef } from 'react';

import styles from './EmailForm.module.css';

import { getUserAuthCtx } from '../../../../context/authContext';

const EmailForm = ({ formModeIsSignIn, setFormModeIsSignIn }) => {
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
      passwordInput.current.value
    );
  };

  return (
    <form className={styles.EmailForm} onSubmit={handleSubmit}>
      <header>
        <div
          onClick={() => setFormModeIsSignIn(true)}
          className={`${styles.formMode} ${
            formModeIsSignIn ? styles.selectedFormMode : ''
          }`}>
          SIGN IN
        </div>
        <div
          onClick={() => setFormModeIsSignIn(false)}
          className={`${styles.formMode} ${
            !formModeIsSignIn ? styles.selectedFormMode : ''
          }`}>
          SIGN UP
        </div>
      </header>

      <div className={styles.formContent}>
        <input
          type='email'
          placeholder='Your email'
          ref={emailInput}
          required
        />
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
      </div>
    </form>
  );
};

export default EmailForm;
