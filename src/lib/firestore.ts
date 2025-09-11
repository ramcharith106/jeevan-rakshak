import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

// --- Request Management ---

export const submitBloodRequest = async (formData: any, user: User) => {
  return await addDoc(collection(db, "requests"), {
    ...formData,
    units: parseInt(formData.units, 10) || 0,
    userId: user.uid,
    createdAt: Timestamp.now(),
    status: "open",
  });
};

export const fetchOpenRequests = async () => {
  const q = query(collection(db, "requests"), where("status", "==", "open"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchAllRequestsForAdmin = async () => {
  const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// --- Donation Workflow ---

export const acceptRequest = async (request: any, donor: User) => {
  const batch = writeBatch(db);
  const donationRef = doc(collection(db, "donations"));

  batch.set(donationRef, {
    userId: donor.uid,
    donorName: donor.displayName || donor.email,
    bloodGroup: request.bloodGroup,
    recipientName: request.name,
    hospital: request.hospital,
    requestId: request.id,
    createdAt: new Date(),
    status: "pending",
  });

  const requestRef = doc(db, "requests", request.id);
  batch.update(requestRef, {
    status: "pending_fulfillment",
    donorId: donor.uid,
    donorName: donor.displayName || donor.email,
    donationId: donationRef.id,
  });

  await batch.commit();
};

export const markRequestAsFulfilled = async (request: any) => {
  const batch = writeBatch(db);
  
  const requestRef = doc(db, "requests", request.id);
  batch.update(requestRef, { status: "fulfilled" });

  if (request.donationId) {
    const donationRef = doc(db, "donations", request.donationId);
    batch.update(donationRef, { status: "completed" });
  }
  if (request.donorId) {
    const donorRef = doc(db, "users", request.donorId);
    batch.update(donorRef, { donationCount: increment(1) });
  }

  await batch.commit();
};

export const logExternalDonation = async (formData: any, user: User) => {
    return await addDoc(collection(db, "donations"), {
        ...formData,
        userId: user.uid,
        donorName: user.displayName || user.email,
        status: 'completed',
        type: 'external',
        createdAt: Timestamp.now(),
    });
};


// --- User & Profile Management ---

export const getUserProfile = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserAvailability = async (uid: string, isAvailable: boolean) => {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, { availability: isAvailable });
};

export const fetchUserDashboardData = async (uid: string) => {
    const profile = await getUserProfile(uid);

    const requestSnap = await getDocs(
      query(collection(db, "requests"), where("userId", "==", uid), orderBy("createdAt", "desc"))
    );
    const requests = requestSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const donationSnap = await getDocs(
      query(collection(db, "donations"), where("userId", "==", uid), orderBy("createdAt", "desc"))
    );
    const donations = donationSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return { profile, requests, donations };
}

// --- In-App Notifications ---

export const updateUserLastCheckedNotifications = async (uid: string) => {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, { lastCheckedNotifications: serverTimestamp() });
};

export const fetchNewRequestsCount = async (userState: string, lastChecked: Timestamp) => {
    if (!userState || !lastChecked) return 0;

    const q = query(
        collection(db, "requests"),
        where("state", "==", userState),
        where("status", "==", "open"),
        where("createdAt", ">", lastChecked)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
};


// --- Search ---

export const searchAvailableDonors = async (filters: { bloodGroup?: string, state?: string }) => {
    let donorQuery = query(
      collection(db, "users"),
      where("availability", "==", true)
    );

    if (filters.bloodGroup) {
      donorQuery = query(donorQuery, where("bloodGroup", "==", filters.bloodGroup));
    }
    if (filters.state) {
      donorQuery = query(donorQuery, where("state", "==", filters.state));
    }

    const querySnapshot = await getDocs(donorQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


// --- Admin Panel ---

export const addBloodBank = async (formData: any) => {
    return await addDoc(collection(db, "blood_banks"), {
        ...formData,
        createdAt: Timestamp.now(),
    });
}

export const addDonationCamp = async (formData: any) => {
    return await addDoc(collection(db, "donation_camps"), {
        ...formData,
        createdAt: Timestamp.now(),
    });
}

// --- Camps & Banks ---

export const fetchBloodBanks = async () => {
    const q = query(collection(db, "blood_banks"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const fetchDonationCamps = async () => {
    const q = query(collection(db, "donation_camps"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- Leaderboard ---

export const fetchTopDonors = async () => {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("donationCount", ">", 0),
      orderBy("donationCount", "desc"),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}