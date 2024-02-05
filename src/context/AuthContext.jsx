import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  addAuthListener,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logout,
} from '../utils/firebase/firebaseAuthActions';
import {
  addPlayerListener,
  addMultiplePlayersListener,
  addMultipleTournamentsListener,
  addMultipleMatchesListener,
} from '../utils/firebase/firestore/firestoreActions';

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPlayerProfile, setUserPlayerProfile] = useState(null);
  const [updatedUserTournaments, setUpdatedUserTournaments] = useState({
    all: [],
    active: [],
    finished: [],
  });
  const [updatedUserTournamentsPlayers, setUpdatedUserTournamentsPlayers] =
    useState([]);
  const [updatedActiveTournamentsMatches, setUpdatedActiveTournamentsMatches] =
    useState([]);
  const navigate = useNavigate();

  // add listener to user auth:
  useEffect(() => addAuthListener(setUser), []);

  // add listener to user player:
  useEffect(() => {
    if (user) {
      const unsubscribe = addPlayerListener(user.uid, setUserPlayerProfile);
      return () => unsubscribe();
    } else {
      setUserPlayerProfile(null);
    }
  }, [user]);

  // add listener to user tournaments:
  useEffect(() => {
    if (userPlayerProfile?.tournaments.all.length > 0) {
      const unsubscribe = addMultipleTournamentsListener(
        userPlayerProfile.tournaments.all,
        setUpdatedUserTournaments
      );
      return () => unsubscribe();
    } else {
      setUpdatedUserTournaments({
        all: [],
        active: [],
        finished: [],
      });
    }
  }, [userPlayerProfile?.tournaments.all]);

  // add listener to user contacts:
  useEffect(() => {
    if (updatedUserTournaments?.all?.length > 0) {
      const tournamentPlayersIds = Array.from(
        new Set(
          updatedUserTournaments?.all?.flatMap(
            (tournament) => tournament.players
          )
        )
      );
      const unsubscribe = addMultiplePlayersListener(
        tournamentPlayersIds,
        setUpdatedUserTournamentsPlayers
      );
      return () => unsubscribe();
    } else {
      setUpdatedUserTournamentsPlayers([]);
    }
  }, [updatedUserTournaments?.all]);

  // add listener to active tournaments matches:
  useEffect(() => {
    if (updatedUserTournaments?.active?.length > 0) {
      const matchesArrays = updatedUserTournaments.active.map(
        (activeTournament) => {
          if (activeTournament.matches.length > 0) {
            return activeTournament.matches.map((matchId) => ({
              id: matchId,
              tournamentId: activeTournament.id,
            }));
          } else {
            return [];
          }
        }
      );
      const unsubscribe = addMultipleMatchesListener(
        matchesArrays,
        setUpdatedActiveTournamentsMatches
      );
      return () => unsubscribe();
    } else {
      setUpdatedActiveTournamentsMatches([]);
    }
  }, [updatedUserTournaments?.active]);

  const userContacts =
    userPlayerProfile && updatedUserTournamentsPlayers
      ? updatedUserTournamentsPlayers
          ?.filter((player) => player.isVerified)
          .filter((player) => player.id !== userPlayerProfile.id)
      : [];

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
        updatedActiveTournamentsMatches,
        updatedUserTournamentsPlayers,
        userContacts,
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
