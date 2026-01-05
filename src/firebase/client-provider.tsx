// src/firebase/client-provider.tsx
'use client';

import { useEffect, useState } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { FirebaseProvider, initializeFirebase } from '@/firebase';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
  } | null>(null);

  useEffect(() => {
    const init = async () => {
      const firebaseInstances = await initializeFirebase();
      setFirebase(firebaseInstances);
    };
    init();
  }, []);

  if (!firebase) {
    // You can return a loading spinner here
    return null;
  }

  return (
    <FirebaseProvider
      app={firebase.app}
      firestore={firebase.firestore}
      auth={firebase.auth}
    >
      {children}
    </FirebaseProvider>
  );
}