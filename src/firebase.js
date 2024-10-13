// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

import { getAuth, GoogleAuthProvider } from 'firebase/auth'

export const firebaseConfig = {
  apiKey: "AIzaSyCwrloFlMaxbbnoH8aQS-JNOOKLoQrAzAw",
  authDomain: "uneko-web.firebaseapp.com",
  projectId: "uneko-web",
  storageBucket: "uneko-web.appspot.com",
  messagingSenderId: "44053262798",
  appId: "1:44053262798:web:e7dff753ace2b8f971bb9f",
  measurementId: "G-GXPW2T2B12"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();