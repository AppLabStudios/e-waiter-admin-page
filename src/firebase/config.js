import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

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
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app); 