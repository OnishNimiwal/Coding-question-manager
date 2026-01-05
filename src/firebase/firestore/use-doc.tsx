'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, doc, type DocumentData, type DocumentReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

export const useDoc = <T extends DocumentData>(
  ref: DocumentReference | null
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !ref) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = { id: snapshot.id, ...snapshot.data() } as T;
          setData(data);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, ref]);

  return { data, loading, error };
};
