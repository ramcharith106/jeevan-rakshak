// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging"; // Import getMessaging

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGGy_MHtFt-DsErVzmaduxyzw-SpoW5Cc",
  authDomain: "van-rakshak-cm009.firebaseapp.com",
  projectId: "van-rakshak-cm009",
  storageBucket: "van-rakshak-cm009.firebasestorage.app",
  messagingSenderId: "244996681126",
  appId: "1:244996681126:web:d3b3556f52ef3d0574f367"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app); // Initialize and export messaging