import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "XX-Ls",
  authDomain: "XX.firebaseapp.com",
  projectId: "XX",
  storageBucket: "XX.appspot.com",
  messagingSenderId: "XX",
  appId: "1:XX:web:1518cf162499bb90ccebe6",
  measurementId: "G-XX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export { auth, db, app, googleProvider, facebookProvider, twitterProvider, analytics };