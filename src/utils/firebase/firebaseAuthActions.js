import { redirect } from 'react-router-dom';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { getPlayerProfileFromUser } from './firestore/firestoreActions';

export const authListener = (setUser, setUserPlayerProfile) => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      const playerProfile = await getPlayerProfileFromUser(currentUser);
      setUserPlayerProfile(playerProfile);
    } else {
      setUser(null);
      setUserPlayerProfile(null);
    }
  });
  return () => unsubscribe();
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

export const signInWithEmail = async (email, password) => {
  //   const userCredential = await signInWithEmailAndPassword(
  await signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email, password) => {
  //   const userCredential = await createUserWithEmailAndPassword(
  await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => await signOut(auth);
