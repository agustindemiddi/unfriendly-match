import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  authListener,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logout,
} from '../utils/firebase/firebaseAuthActions';
import {
  addMultipleTournamentsListener,
  addPlayerListener,
} from '../utils/firebase/firestore/firestoreActions';

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPlayerProfile, setUserPlayerProfile] = useState(null);
  const [updatedUserTournaments, setUpdatedUserTournaments] = useState(null);
  const [updatedUserPlayerProfile, setUpdatedUserPlayerProfile] =
    useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // add listener to user auth:
    const unsubscribe = authListener(setUser, setUserPlayerProfile);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userPlayerProfile) {
      // add listener to user playerDoc:
      const unsubscribe = addPlayerListener(
        userPlayerProfile.id,
        setUpdatedUserPlayerProfile
      );
      return () => unsubscribe();
    }
  }, [userPlayerProfile]);

  useEffect(() => {
    if (userPlayerProfile && userPlayerProfile.tournaments.all.length > 0) {
      // add listener to user tournamentDocs:
      const unsubscribe = addMultipleTournamentsListener(
        userPlayerProfile.tournaments.all,
        setUpdatedUserTournaments
      );
      return () => unsubscribe();
    } else {
      setUpdatedUserTournaments([]);
    }
  }, [userPlayerProfile?.tournaments.all]);

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
        updatedUserTournaments,
        updatedUserPlayerProfile,
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
