import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {};
if (import.meta.env.MODE === 'development') {
  (firebaseConfig.apiKey = import.meta.env.VITE_API_KEY),
    (firebaseConfig.authDomain = import.meta.env.VITE_AUTH_DOMAIN),
    (firebaseConfig.projectId = import.meta.env.VITE_PROJECT_ID),
    (firebaseConfig.storageBucket = import.meta.env.VITE_STORAGE_BUCKET),
    (firebaseConfig.messagingSenderId =
      import.meta.env.VITE_MESSAGING_SENDER_ID),
    (firebaseConfig.appId = import.meta.env.VITE_APP_ID),
    (firebaseConfig.measurementId = import.meta.env.VITE_MEASUREMENT_ID);
}

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export default db;

export const auth = getAuth(app);

// const analytics = getAnalytics(app);
