import { createContext, useContext, useState, useEffect } from 'react';

import {
  authListener,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logout,
} from '../utils/firebase/firebaseAuthActions';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPlayerProfile, setUserPlayerProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = authListener(setUser, setUserPlayerProfile);
    return () => unsubscribe();
  }, []);

  // auth.useDeviceLanguage(); // test how it works

  const handleGoogleSignIn = async () => signInWithGoogle();

  const handleEmailSignIn = async (formModeIsSignIn, email, password) =>
    formModeIsSignIn
      ? signInWithEmail(email, password)
      : signUpWithEmail(email, password);

  const handleSignOut = () => {
    setUser(null);
    // setUserPlayerProfile(null);
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userPlayerProfile,
        handleGoogleSignIn,
        handleEmailSignIn,
        handleSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const getUserAuthCtx = () => {
  return useContext(AuthContext);
};
