import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

const PRODUCTS_KEY = ['products'] as const;

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async (): Promise<Product[]> => {
      const response = await fetch('https://dummyjson.com/products?limit=100');
      if (!response.ok) throw new Error('Erreur lors de la récupération des produits de l\'API');
      
      const data = await response.json();
      
      return data.products.map((prod: any) => {
        let appCategory = 'accessoires';
        if (prod.category.includes('laptop')) appCategory = 'pc-portables';
        if (prod.category.includes('smartphone') || prod.category.includes('mobile')) appCategory = 'smartphones';

        return {
          id: `api-${prod.id}`,
          name: prod.title,
          description: prod.description,
          price: Math.floor(prod.price * 0.9),
          image: prod.thumbnail,
          category: appCategory,
          brand: prod.brand || 'Générique',
          rating: prod.rating || 4.5,
          isPromo: prod.discountPercentage > 12,
          featured: prod.rating >= 4.5
        };
      });
    },
    staleTime: 1000 * 60 * 5,
  });
}

// La fonction manquante réclamée par src/pages/Catalogue.tsx
export function filterAndSortProducts(
  products: Product[],
  category: string | null,
  brand: string | null,
  search: string | null,
  sort: string | null,
  promo: string | null
): Product[] {
  let result = [...products];

  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }
  if (brand) {
    result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }
  if (search) {
    result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }
  if (promo === '1') {
    result = result.filter(p => p.isPromo);
  }

  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
}
