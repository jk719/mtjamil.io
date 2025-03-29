import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs,
  getDoc,
  setDoc,
  doc,
  Firestore,
  CollectionReference,
  DocumentData,
  Timestamp,
  serverTimestamp 
} from "firebase/firestore";
import type { FeedbackDocument } from '@/types/feedback';
import type { UserProfile } from '@/types/profile';

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('Missing Firebase configuration');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Firestore
const db: Firestore = getFirestore(app);

// Create collection references
const feedbackCollection = collection(db, 'feedback') as CollectionReference<FeedbackDocument>;
const profilesCollection = collection(db, 'profiles') as CollectionReference<UserProfile>;

// Initialize Auth
export const auth = getAuth(app);

export { 
  db, 
  collection, 
  addDoc,
  getDoc,
  setDoc,
  doc, 
  getDocs, 
  feedbackCollection,
  profilesCollection,
  Timestamp, 
  serverTimestamp 
};
export type { CollectionReference, DocumentData };