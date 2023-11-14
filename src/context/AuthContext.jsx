import { createContext, useContext, useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import db from '../utils/firebaseConfig';
// import { pickRandomEmoji } from '../utils/emoji';
import defaultProfileImage from '../assets/profile-circle-svgrepo-com.svg'

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const setPlayer = async (id, playerName, profilePicture = null) => {
    try {
      await setDoc(doc(db, 'players', id), {
        name: playerName,
        image: profilePicture,
      });
    } catch {
      console.log('Could not save player!');
    }
  };

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const signInMethod = currentUser.providerData[0].providerId;
        const { uid } = currentUser;
        try {
          const docRef = doc(db, 'players', uid);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            if (signInMethod === 'google.com') {
              const { displayName, photoURL } = currentUser;
              setPlayer(uid, displayName, photoURL);
            } else if (signInMethod === 'password') {
              const displayName = currentUser.email.split('@')[0];
              // const randomImage = pickRandomEmoji();
              setPlayer(uid, displayName, defaultProfileImage);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
    return () => {
      unsuscribe();
    };
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const getUserAuthCtx = () => {
  return useContext(AuthContext);
};
