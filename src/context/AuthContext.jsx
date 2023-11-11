import { createContext, useContext, useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';

const AuthContext = createContext();
// Default values for intelisense:
// const AuthContext = createContext({
//   isSignedIn: false,
//   googleSignIn: () => {},
//   googleSignOut: () => {},
// });

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsuscribe();
    };
  }, []);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const googleSignOut = () => {
    signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ googleSignIn, googleSignOut, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const getUserAuthCtx = () => {
  return useContext(AuthContext);
};

// export default AuthContext;
