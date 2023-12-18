import { createContext, useContext, useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../utils/firebase/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import db from '../utils/firebase/firebaseConfig';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPlayerProfile, setUserPlayerProfile] = useState(null);

  const createPlayerFromUser = async (id, username, profilePicture) => {
    try {
      const playerData = {
        username: username,
      };
      if (profilePicture) playerData.image = profilePicture;
      await setDoc(doc(db, 'players', id), playerData);
    } catch {
      console.log('Could not save player!');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const signInMethod = currentUser.providerData[0].providerId;
        const { uid } = currentUser;
        // localStorage.setItem('userId', uid);
        try {
          const docRef = doc(db, 'players', uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserPlayerProfile({
              ...docSnap.data(),
              id: docSnap.id,
              image: docSnap.data().image || '/default-user.svg',
            });
            // const userPlayerProfile = { ...docSnap.data(), id: docSnap.id };
            // localStorage.setItem('userPlayerProfile', userPlayerProfile);
          } else {
            if (signInMethod === 'google.com') {
              const { displayName, photoURL } = currentUser;
              await createPlayerFromUser(uid, displayName, photoURL);
            } else if (signInMethod === 'password') {
              const displayName = currentUser.email.split('@')[0];
              await createPlayerFromUser(uid, displayName);
            }
            const docRef = doc(db, 'players', uid);
            const docSnap = await getDoc(docRef);
            setUserPlayerProfile({
              ...docSnap.data(),
              id: docSnap.id,
              image: docSnap.data().image || '/default-user.svg',
            });
            // const userPlayerProfile = { ...docSnap.data(), id: docSnap.id };
            // localStorage.setItem('userPlayerProfile', userPlayerProfile);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEmailSignIn = async (email, password, formModeIsSignIn) => {
    try {
      if (formModeIsSignIn) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      // console.log(userCredential.user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    // auth.useDeviceLanguage(); // test how it works
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = () => {
    try {
      signOut(auth);
      setUser(null);
      // localStorage.removeItem('userId');
      // localStorage.removeItem('userPlayerProfile');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        handleGoogleSignIn,
        handleEmailSignIn,
        handleSignOut,
        user,
        userPlayerProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const getUserAuthCtx = () => {
  return useContext(AuthContext);
};
