//to initialize firebase in our project
import { initializeApp } from "firebase/app";
//for authentication purpose
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";



//unique credintials

const firebaseConfig = {
  apiKey: "AIzaSyDhSNIW6LO65UfHP0RrFGpsi8PHKsLTLkQ",
  authDomain: "studentmanagementsystem-20a6e.firebaseapp.com",
  projectId: "studentmanagementsystem-20a6e",
  storageBucket: "studentmanagementsystem-20a6e.firebasestorage.app",
  messagingSenderId: "277754952161",
  appId: "1:277754952161:web:a591e9fb8762655f5b3aa0",
  measurementId: "G-6V9L3JFBX1"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db , collection, addDoc, query, where, getDocs };
