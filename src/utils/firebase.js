// utils/firebase.js - Enhanced version
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Offline support
export const enableOfflineMode = () => disableNetwork(db);
export const enableOnlineMode = () => enableNetwork(db);

// Cloud Functions for secure operations
export const createAnonymousShare = httpsCallable(
  functions,
  'createAnonymousShare',
);
export const reportCommunityContent = httpsCallable(
  functions,
  'reportCommunityContent',
);

export { analytics };
