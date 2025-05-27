// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApC4DSCV50YJ6XS33e5LYb0Inc4QsQWB4",
  authDomain: "meetease-93921.firebaseapp.com",
  projectId: "meetease-93921",
  storageBucket: "meetease-93921.firebasestorage.app",
  messagingSenderId: "799309372821",
  appId: "1:799309372821:web:d067c268b9f98511ddaa9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);