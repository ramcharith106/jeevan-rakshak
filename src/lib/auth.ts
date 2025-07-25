import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// ✅ Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDocRef = doc(db, "users", user.uid);
  await setDoc(
    userDocRef,
    {
      email: user.email,
      name: user.displayName || "",
      provider: "google",
      photoURL: user.photoURL || "",
      createdAt: new Date(),
    },
    { merge: true }
  );

  return user;
};

// ✅ Email/Password Signup with extended blood donor details
export const registerUser = async ({
  email,
  password,
  phone,
  aadhaar,
  address,
  dob,
  bloodGroup,
  weight,
  emergencyContact1,
  emergencyContact2,
  healthInfo,
}: {
  email: string;
  password: string;
  phone: string;
  aadhaar: string;
  address: string;
  dob: string;
  bloodGroup: string;
  weight: string;
  emergencyContact1: string;
  emergencyContact2: string;
  healthInfo: string;
}) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, {
    email,
    phone,
    aadhaar,
    address,
    dob,
    bloodGroup,
    weight,
    emergencyContact1,
    emergencyContact2,
    healthInfo,
    createdAt: new Date(),
  });

  return user;
};

// ✅ Email/Password Login
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// ✅ Logout
export const logout = async () => {
  await signOut(auth);
};

// ✅ Get Current User
export const getCurrentUser = () => {
  return auth.currentUser;
};
