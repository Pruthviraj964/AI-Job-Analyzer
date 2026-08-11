import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC56qtT6d4MFd2Y3bSOsvg6DztSCG3aSB6k",
  authDomain: "ai-job-analyzer-d4c4b.firebaseapp.com",
  projectId: "ai-job-analyzer-d4c4b",
  storageBucket: "ai-job-analyzer-d4c4b.firebasestorage.app",
  messagingSenderId: "879952918712",
  appId: "1:879952918712:web:d2da5ba55df4df8b9a9c4d",
  measurementId: "G-8KDWXY3QFR",
};

// Initialize Firebase app safely for SSR/Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
};
export default app;
