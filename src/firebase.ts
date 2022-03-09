import { initializeApp } from 'firebase/app';
import { useState, useEffect } from 'react';
import {
  getFirestore,
  query,
  collection,
  orderBy,
  limit,
  getDocs,
  where,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';

import {
  User as FirebaseUser,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: 'G-N1MGDFF41J',
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const messagesRef = collection(db, 'messages');

const getMessageQuery = (n: number) => {
  const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(n));
  return q;
};

const signInWithGoogle = async () => {
  // signInWithRedirect(auth, provider)
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.log(err);
  }
};

const signOutUser = () => {
  // Sign out of Firebase.
  signOut(auth);
};

// Returns true if a user is signed-in.
const isUserSignedIn = () => {
  return !!auth.currentUser;
};

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return auth.currentUser?.photoURL || '/images/default_profile.jpg';
}

// Returns the signed-in user's display name.
function getUserName() {
  return auth.currentUser?.displayName || 'User';
}

/** Update all messages' profile image that were sent by this signed-in user.
 * @param uid - User id
 * @param url - The new profile image url
 */
async function getMessagesAndUpdatePhoto(uid: string, url: string) {
  try {
    const q = query(messagesRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    // could not await in side the forEach loop, use map instead
    // querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // updateDoc(doc.ref, {
    //   photoURL,
    // })
    // })
    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        await updateDoc(doc.ref, { photoURL: url });
      })
    );
  } catch (err) {
    console.error(err);
  }
}

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithGoogle,
  getProfilePicUrl,
  isUserSignedIn,
  getUserName,
  signOutUser,
  messagesRef,
  getMessageQuery,
  onSnapshot,
  updateProfile,
  getMessagesAndUpdatePhoto,
};

/** custome hook to get the current user. */
export function useAuth() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      setCurrentUser(user)
    );
    return unsubscribe;
  }, []);
  return currentUser;
}
