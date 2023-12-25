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
  const listener = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      //   return redirect('/signin'); // redirect not working
    } else {
      setUser(currentUser);
      const playerProfileFromUser = await getPlayerProfileFromUser(currentUser);
      setUserPlayerProfile(playerProfileFromUser);
    }
  });
  return () => listener();
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

export const logout = () => signOut(auth);
