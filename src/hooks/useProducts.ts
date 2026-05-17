import { useQuery } from '@tanstack/react-query';
import {
  fetchAllProducts,
  fetchProductsByCategorySlug,
  searchProducts,
  getFeaturedProducts,
  getPromoProducts,
  getNewProducts,
} from '../lib/products';
import type { Product } from '../types';

const PRODUCTS_KEY = ['products'] as const;

export function useProducts() {
  const query = useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5,
  });

  const products = query.data ?? [];

  return {
    products,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    getFeatured: () => getFeaturedProducts(products),
    getPromos: () => getPromoProducts(products),
    getNew: () => getNewProducts(products),
    search: (q: string) => searchProducts(products, q),
    getByCategory: (categorySlug: string) =>
      products.filter((p) => p.categorySlug === categorySlug),
    getByBrand: (brand: string) =>
      products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase()),
  };
}

export function useProductsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, 'category', categorySlug],
    queryFn: () => fetchProductsByCategorySlug(categorySlug),
    enabled: Boolean(categorySlug),
  });
}

export function filterAndSortProducts(
  products: Product[],
  options: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStockOnly?: boolean;
    promoOnly?: boolean;
    sort?: string;
  }
): Product[] {
  let list = [...products];

  if (options.category) {
    list = list.filter((p) => p.categorySlug === options.category);
  }
  if (options.brand) {
    list = list.filter(
      (p) => p.brand.toLowerCase() === options.brand!.toLowerCase()
    );
  }
  if (options.minPrice != null) {
    list = list.filter((p) => p.price >= options.minPrice!);
  }
  if (options.maxPrice != null) {
    list = list.filter((p) => p.price <= options.maxPrice!);
  }
  if (options.minRating != null && options.minRating > 0) {
    list = list.filter((p) => p.rating >= options.minRating!);
  }
  if (options.inStockOnly) {
    list = list.filter((p) => p.stock > 0);
  }
  if (options.promoOnly) {
    list = list.filter(
      (p) => p.comparePrice != null && p.comparePrice > p.price
    );
  }

  switch (options.sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return list.sort((a, b) =>
        (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
      );
    default:
      return list;
  }
}
