import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  authListener,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logout,
} from '../utils/firebase/firebaseAuthActions';
import {
  addMultipleTournamentsListener,
  getTournamentMatches,
  addMultipleMatchesListener,
} from '../utils/firebase/firestore/firestoreActions';

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPlayerProfile, setUserPlayerProfile] = useState(null);
  const [updatedUserTournaments, setUpdatedUserTournaments] = useState(null);
  const [updatedTournamentMatches, setUpdatedTournamentMatches] =
    useState(null);
  const { tournamentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // add listener to user auth:
    const unsubscribe = authListener(setUser, setUserPlayerProfile);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userPlayerProfile && userPlayerProfile.tournaments.all.length > 0) {
      // add listener to user tournaments:
      const unsubscribe = addMultipleTournamentsListener(
        userPlayerProfile.tournaments.all,
        setUpdatedUserTournaments
      );
      return () => unsubscribe();
    } else {
      setUpdatedUserTournaments([]);
    }
  }, [userPlayerProfile?.tournaments.all]);

  useEffect(() => {
    if (location.pathname.startsWith(`/tournaments/${tournamentId}`)) {
      // fetch tournament matches:
      const fetchTournamentMatches = async () => {
        const fetchedMatches = await getTournamentMatches(tournamentId);
        if (fetchedMatches.length > 0) {
          const MatchesIdsArray = fetchedMatches.map((match) => match.id);
          // add listener to tournament matches:
          const unsubscribe = addMultipleMatchesListener(
            tournamentId,
            MatchesIdsArray,
            setUpdatedTournamentMatches
          );
          return () => unsubscribe();
        } else {
          setUpdatedTournamentMatches([]);
        }
      };
      fetchTournamentMatches();
    }
  }, [tournamentId]);

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
        updatedUserTournaments,
        updatedTournamentMatches,
        setUserPlayerProfile,
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
