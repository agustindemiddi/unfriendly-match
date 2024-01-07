import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  authListener,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logout,
} from '../utils/firebase/firebaseAuthActions';
import { addUserPlayerListener } from '../utils/firebase/firestore/firestoreActions';

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPlayerProfile, setUserPlayerProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = authListener(setUser, setUserPlayerProfile);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userPlayerProfile) {
      const unsubscribe = addUserPlayerListener(
        userPlayerProfile.id,
        setUserPlayerProfile
      );
      return () => unsubscribe();
    }
  }, []);

  // auth.useDeviceLanguage(); // test how it works

  const handleGoogleSignIn = async () => await signInWithGoogle();

  const handleEmailSignIn = async (formModeIsSignIn, email, password) =>
    formModeIsSignIn
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password);

  const handleSignOut = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <authContext.Provider
      value={{
        user,
        userPlayerProfile,
        handleGoogleSignIn,
        handleEmailSignIn,
        handleSignOut,
      }}>
      {children}
    </authContext.Provider>
  );
};

export const getUserAuthCtx = () => {
  return useContext(authContext);
};
