// lib/firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// --- 1. IMPORT getAuth (THIS WAS MISSING) ---
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCc3DImi854UhOd-6qWwiQLTCCT1a9d0wU",
  authDomain: "ai-career-project.firebaseapp.com",
  projectId: "ai-career-project",
  storageBucket: "ai-career-project.firebasestorage.app",
  messagingSenderId: "316339534161",
  appId: "1:316339534161:web:7a25c00ab2694da5633b70",
  measurementId: "G-D5Q7G71QZF"
};
// Initialize Firebase
// This check prevents re-initializing the app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- 2. EXPORT THE AUTH SERVICE (THIS WAS MISSING) ---
// This creates the 'auth' variable that your signup page needs
export const auth = getAuth(app);