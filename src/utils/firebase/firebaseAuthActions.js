import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { checkAndAddPlayer } from './firestore/firestoreActions';

export const addAuthListener = (setUser) => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      await checkAndAddPlayer(currentUser);
      setUser(currentUser);
    } else {
      setUser(null);
    }
  });
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
