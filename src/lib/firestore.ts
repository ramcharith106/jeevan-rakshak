import { db } from "./firebase";
import { collection, addDoc, setDoc, doc, serverTimestamp } from "firebase/firestore";

// Save donor/user profile to Firestore
export async function saveUserProfile(uid: string, data: any) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// Submit blood request
export async function submitBloodRequest(data: any) {
  const requestsRef = collection(db, "requests");
  await addDoc(requestsRef, {
    ...data,
    status: "Pending",
    createdAt: serverTimestamp(),
  });
}
