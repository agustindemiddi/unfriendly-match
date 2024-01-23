import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export const addAuthListener = (setUser) => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) =>
    currentUser ? setUser(currentUser) : setUser(null)
  );
  return () => unsubscribe();
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

export const signInWithEmail = async (email, password) =>
  await signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = async (email, password) =>
  await createUserWithEmailAndPassword(auth, email, password);

export const logout = async () => await signOut(auth);
