import { initializeApp } from 'firebase/app'
import { useState, useEffect } from 'react'
import {
  getFirestore,
  query,
  collection,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  Timestamp,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth'

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDJBHpBTyk0rq2_j3-9Yywg-x9_wvUQNnQ',
  authDomain: 'auth-development-3eefa.firebaseapp.com',
  projectId: 'auth-development-3eefa',
  storageBucket: 'auth-development-3eefa.appspot.com',
  messagingSenderId: '553742939413',
  appId: '1:553742939413:web:9a658201c3ebe29565251c',
  measurementId: '${config.measurementId}',
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth()
const provider = new GoogleAuthProvider()
const messagesRef = collection(db, 'messages')

const getMessageQuery = () => {
  const q = query(messagesRef, orderBy('createdAt'), limit(50))
  return q
}

const signInWithGoogle = async () => {
  // signInWithRedirect(auth, provider)
  try {
    await signInWithPopup(auth, provider)
  } catch (err) {
    console.log(err)
  }
}

const signOutUser = () => {
  // Sign out of Firebase.
  signOut(auth)
}

// Returns true if a user is signed-in.
const isUserSignedIn = () => {
  return !!auth.currentUser
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return auth.currentUser.photoURL || '/images/default_profile.jpg'
}

// Returns the signed-in user's display name.
function getUserName() {
  return auth.currentUser.displayName
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
}

// custome hook to get the current user
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user))
    return unsubscribe
  }, [])
  return currentUser
}
