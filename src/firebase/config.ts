// src/firebase/config.ts
import type { FirebaseOptions } from 'firebase/app';

// This configuration is replaced by the App Hosting environment.
// It is safe to leave these values as-is.
export const firebaseConfig: FirebaseOptions = {
  apiKey: 'fake-api-key',
  authDomain: 'fake-project.firebaseapp.com',
  projectId: 'fake-project',
  storageBucket: 'fake-project.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:12345abcdef',
};
