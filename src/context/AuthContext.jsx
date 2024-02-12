import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  addTournamentListener,
  addMultipleTournamentsListener,
  addMultipleMatchesArraysListener,
  addMultipleMatchesListener,
} from '../utils/firebase/firestore/firestoreActions';

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { tournamentId } = useParams();
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
  const [unsubscribedTournament, setUnsubscribedTournament] = useState(null);
  const [unsubscribedTournamentPlayers, setUnsubscribedTournamentPlayers] =
    useState([]);
  const [unsubscribedTournamentMatches, setUnsubscribedTournamentMatches] =
    useState([]);
  const navigate = useNavigate();

  // add listener to user auth:
  useEffect(() => addAuthListener(setUser), []);

  // add listener to user player:
  useEffect(() => {
    if (user) {
      const unsubscribe = addPlayerListener(user.uid, setUserPlayerProfile);
      return () => unsubscribe();
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
      const unsubscribe = addMultipleMatchesArraysListener(
        matchesArrays,
        setUpdatedActiveTournamentsMatches
      );
      return () => unsubscribe();
    }
  }, [updatedUserTournaments?.active]);

  // add listener to unsubscribed tournament:
  useEffect(() => {
    if (
      location.pathname.startsWith(`/tournaments/${tournamentId}`) &&
      !userPlayerProfile?.tournaments.all.includes(tournamentId)
    ) {
      const unsubscribe = addTournamentListener(
        tournamentId,
        setUnsubscribedTournament
      );
      return () => unsubscribe();
    }
  }, [tournamentId]);

  // add listener to unsubscribed tournament players:
  useEffect(() => {
    if (
      location.pathname.startsWith(`/tournaments/${tournamentId}`) &&
      !userPlayerProfile?.tournaments.all.includes(tournamentId) &&
      unsubscribedTournament
    ) {
      const unsubscribe = addMultiplePlayersListener(
        unsubscribedTournament.players,
        setUnsubscribedTournamentPlayers
      );
      return () => unsubscribe();
    }
  }, [tournamentId, unsubscribedTournament]);

  // add listener to unsubscribed tournament matches:
  useEffect(() => {
    if (
      location.pathname.startsWith(`/tournaments/${tournamentId}`) &&
      !userPlayerProfile?.tournaments.all.includes(tournamentId) &&
      unsubscribedTournament?.matches.length > 0
    ) {
      const unsubscribe = addMultipleMatchesListener(
        tournamentId,
        unsubscribedTournament.matches,
        setUnsubscribedTournamentMatches
      );
      return () => unsubscribe();
    }
  }, [tournamentId, unsubscribedTournament]);

  const userContacts =
    userPlayerProfile && updatedUserTournamentsPlayers
      ? updatedUserTournamentsPlayers
          ?.filter((player) => player.isVerified)
          .filter((player) => player.id !== userPlayerProfile.id)
      : [];

  // auth.useDeviceLanguage(); // test how it works

  const handleGoogleLogin = async () => await signInWithGoogle();

  const handleEmailLogin = async (formModeIsSignIn, email, password) =>
    formModeIsSignIn
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password);

  const handleLogout = async () => {
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
        unsubscribedTournament,
        unsubscribedTournamentPlayers,
        unsubscribedTournamentMatches,
        handleGoogleLogin,
        handleEmailLogin,
        handleLogout,
      }}>
      {children}
    </authContext.Provider>
  );
};

export const getUserAuthCtx = () => {
  return useContext(authContext);
};
