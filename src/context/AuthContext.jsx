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
  const [
    updatedUserActiveTournamentsMatches,
    setUpdatedUserActiveTournamentsMatches,
  ] = useState([]);
  const [updatedUserTournamentsPlayers, setUpdatedUserTournamentsPlayers] =
    useState([]);
  const [updatedTournament, setUpdatedTournament] = useState(null);
  const [updatedTournamentMatches, setUpdatedTournamentMatches] = useState([]);
  const [updatedTournamentPlayers, setUpdatedTournamentPlayers] = useState([]);
  const navigate = useNavigate();

  // add listener to user auth:
  useEffect(() => addAuthListener(setUser), []);

  // add listener to user player profile:
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

  // add listener to user active tournaments matches:
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
        setUpdatedUserActiveTournamentsMatches
      );
      return () => unsubscribe();
    }
  }, [updatedUserTournaments?.active]);

  // add listener to user tournaments players:
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

  // add listener to tournament:
  useEffect(() => {
    if (
      location.pathname.startsWith(`/tournaments/${tournamentId}`)
      // location.pathname.startsWith(`/tournaments/${tournamentId}`) &&
      // !userPlayerProfile?.tournaments.all.includes(tournamentId)
    ) {
      const unsubscribe = addTournamentListener(
        tournamentId,
        setUpdatedTournament
      );
      return () => unsubscribe();
    }
  }, [tournamentId]);

  // add listener to tournament matches:
  useEffect(() => {
    if (
      location.pathname.startsWith(`/tournaments/${tournamentId}`) &&
      // !userPlayerProfile?.tournaments.all.includes(tournamentId) &&
      updatedTournament?.matches.length > 0
    ) {
      const unsubscribe = addMultipleMatchesListener(
        tournamentId,
        updatedTournament.matches,
        setUpdatedTournamentMatches
      );
      return () => unsubscribe();
    }
  }, [tournamentId, updatedTournament]);

  // add listener to tournament players:
  useEffect(() => {
    if (
      location.pathname.startsWith(`/tournaments/${tournamentId}`) &&
      // !userPlayerProfile?.tournaments.all.includes(tournamentId) &&
      updatedTournament
    ) {
      const unsubscribe = addMultiplePlayersListener(
        updatedTournament.players,
        setUpdatedTournamentPlayers
      );
      return () => unsubscribe();
    }
  }, [tournamentId, updatedTournament]);

  const updatedUserContacts =
    userPlayerProfile && updatedUserTournamentsPlayers // creo que la condicion userPlayerProfile es redundante
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
        updatedUserActiveTournamentsMatches,
        updatedUserTournamentsPlayers,
        updatedUserContacts,
        updatedTournament,
        updatedTournamentMatches,
        updatedTournamentPlayers,
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
