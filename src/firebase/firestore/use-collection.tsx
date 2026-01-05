'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  type DocumentData,
  type Query,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

interface UseCollectionOptions {
  // Define any options here, e.g., filters
}

export const useCollection = <T extends DocumentData>(
  q: Query | null,
  options?: UseCollectionOptions
) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !q) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, q]); // Re-run effect if firestore or query changes

  return { data, loading, error };
};
