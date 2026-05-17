import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { Order, OrderItem } from '../types';

const ORDERS_KEY = ['orders'] as const;

function mapOrder(id: string, data: Record<string, unknown>): Order {
  return {
    id,
    userId: String(data.userId ?? ''),
    stripeSessionId: data.stripeSessionId as string | undefined,
    status: (data.status as Order['status']) ?? 'pending',
    items: (data.items as OrderItem[]) ?? [],
    total: Number(data.total ?? 0),
    subtotal: Number(data.subtotal ?? 0),
    shippingCost: Number(data.shippingCost ?? 0),
    shippingAddress: data.shippingAddress as Order['shippingAddress'],
    createdAt: data.createdAt
      ? new Date(
          (data.createdAt as { seconds: number }).seconds * 1000
        ).toISOString()
      : new Date().toISOString(),
  };
}

export function useOrders(userId: string | undefined) {
  return useQuery({
    queryKey: [...ORDERS_KEY, userId],
    queryFn: async () => {
      if (!userId || !db || !isFirebaseConfigured) return [];
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map((d) =>
          mapOrder(d.id, d.data() as Record<string, unknown>)
        );
      } catch {
        return [];
      }
    },
    enabled: Boolean(userId) && isFirebaseConfigured,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Omit<Order, 'id' | 'createdAt'>) => {
      if (!db || !isFirebaseConfigured) {
        const local: Order = {
          ...order,
          id: `local-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        const stored = JSON.parse(
          localStorage.getItem('nexora-orders') || '[]'
        ) as Order[];
        stored.unshift(local);
        localStorage.setItem('nexora-orders', JSON.stringify(stored));
        return local;
      }
      const ref = await addDoc(collection(db, 'orders'), {
        ...order,
        createdAt: serverTimestamp(),
      });
      return { ...order, id: ref.id, createdAt: new Date().toISOString() };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...ORDERS_KEY, variables.userId],
      });
    },
  });
}
