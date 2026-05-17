import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { useAuth } from './useAuth';

const LOCAL_KEY = 'nexora-favorites';

export function useFavorites() {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      if (user && db && isFirebaseConfigured) {
        const snap = await getDocs(
          collection(db, 'favorites', user.uid, 'items')
        );
        setIds(snap.docs.map((d) => d.id));
      } else {
        setIds(JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'));
      }
    }
    load();
  }, [user]);

  const toggleFavorite = useCallback(
    async (productId: string) => {
      const isFav = ids.includes(productId);
      const next = isFav
        ? ids.filter((id) => id !== productId)
        : [...ids, productId];
      setIds(next);

      if (user && db && isFirebaseConfigured) {
        const ref = doc(db, 'favorites', user.uid, 'items', productId);
        if (isFav) await deleteDoc(ref);
        else await setDoc(ref, { productId, addedAt: new Date().toISOString() });
      } else {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      }
    },
    [ids, user]
  );

  const isFavorite = useCallback(
    (productId: string) => ids.includes(productId),
    [ids]
  );

  return { favoriteIds: ids, toggleFavorite, isFavorite };
}
