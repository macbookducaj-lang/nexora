import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import type { Product } from '../types';

function mapDoc(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: String(data.name ?? ''),
    slug: String(data.slug ?? id),
    description: String(data.description ?? ''),
    price: Number(data.price ?? 0),
    comparePrice: data.comparePrice != null ? Number(data.comparePrice) : undefined,
    imageUrl: String(data.imageUrl ?? ''),
    images: (data.images as string[]) ?? [],
    category: String(data.category ?? ''),
    categorySlug: String(data.categorySlug ?? ''),
    brand: String(data.brand ?? ''),
    rating: Number(data.rating ?? 4),
    reviewCount: Number(data.reviewCount ?? 0),
    stock: Number(data.stock ?? 0),
    isActive: data.isActive !== false,
    isFeatured: Boolean(data.isFeatured),
    badges: (data.badges as string[]) ?? [],
    specs: (data.specs as Record<string, string>) ?? {},
    deliveryInfo: String(data.deliveryInfo ?? 'Livraison demain'),
    createdAt: data.createdAt
      ? String((data.createdAt as { toDate?: () => Date }).toDate?.() ?? data.createdAt)
      : undefined,
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured || !db) {
    return MOCK_PRODUCTS.filter((p) => p.isActive);
  }

  try {
    const snap = await getDocs(collection(db, 'products'));
    if (snap.empty) return MOCK_PRODUCTS.filter((p) => p.isActive);
    return snap.docs
      .map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
      .filter((p) => p.isActive);
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.isActive);
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured || !db) {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  try {
    const snap = await getDoc(doc(db, 'products', id));
    if (!snap.exists()) {
      return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
    }
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  } catch {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
}

export async function fetchProductsByCategorySlug(
  categorySlug: string
): Promise<Product[]> {
  const all = await fetchAllProducts();
  if (!isFirebaseConfigured || !db) {
    return all.filter((p) => p.categorySlug === categorySlug);
  }

  try {
    const q = query(
      collection(db, 'products'),
      where('categorySlug', '==', categorySlug),
      where('isActive', '==', true)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return all.filter((p) => p.categorySlug === categorySlug);
    }
    return snap.docs.map((d) =>
      mapDoc(d.id, d.data() as Record<string, unknown>)
    );
  } catch {
    return all.filter((p) => p.categorySlug === categorySlug);
  }
}

export function searchProducts(products: Product[], q: string): Product[] {
  const term = q.trim().toLowerCase();
  if (!term) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
  );
}

export function getFeaturedProducts(products: Product[]): Product[] {
  const featured = products.filter((p) => p.isFeatured);
  return featured.length > 0 ? featured.slice(0, 8) : products.slice(0, 8);
}

export function getPromoProducts(products: Product[]): Product[] {
  return products
    .filter((p) => p.comparePrice != null && p.comparePrice > p.price)
    .slice(0, 8);
}

export function getNewProducts(products: Product[]): Product[] {
  return [...products]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 8);
}
