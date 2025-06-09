// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzdIEbi-9pDDmAdqdETQC26WVE4Y5Ni0o",
  authDomain: "e-waiter-e5747.firebaseapp.com",
  projectId: "e-waiter-e5747",
  storageBucket: "e-waiter-e5747.firebasestorage.app",
  messagingSenderId: "773359174775",
  appId: "1:773359174775:web:0a51e0652eddaa5be2f272",
  measurementId: "G-7YN4ZR03EN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage }; 