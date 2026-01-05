// src/firebase/index.ts
'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export const initializeFirebase = async () => {
  if (getApps().length) {
    app = getApps()[0];
    auth = getAuth(app);
    firestore = getFirestore(app);
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
  }

  // Note: In a real app, you might want to use emulators only in development
  // if (process.env.NODE_ENV === 'development') {
  //   connectAuthEmulator(auth, 'http://localhost:9099');
  //   connectFirestoreEmulator(firestore, 'localhost', 8080);
  // }

  return { app, auth, firestore };
};

export { FirebaseProvider, useFirebaseApp, useFirestore, useAuth } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
