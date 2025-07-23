import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGGy_MHtFt-DsErVzmaduxyzw-SpoW5Cc",
  authDomain: "van-rakshak-cm009.firebaseapp.com",
  projectId: "van-rakshak-cm009",
  storageBucket: "van-rakshak-cm009.firebasestorage.app",
  messagingSenderId: "244996681126",
  appId: "1:244996681126:web:d3b3556f52ef3d0574f367"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
