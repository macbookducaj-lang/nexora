import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

const PRODUCTS_KEY = ['products'] as const;

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async (): Promise<Product[]> => {
      // On demande un max de produits à l'API DummyJSON
      const response = await fetch('https://dummyjson.com/products?limit=100');
      if (!response.ok) throw new Error('Erreur lors de la récupération des produits de l\'API');
      
      const data = await response.json();
      
      // On adapte les données pour qu'elles collent à la structure exacte attendue par ton ProductGrid
      return data.products.map((prod: any) => {
        let appCategory = 'accessoires';
        if (prod.category.includes('laptop')) appCategory = 'pc-portables';
        if (prod.category.includes('smartphone') || prod.category.includes('mobile')) appCategory = 'smartphones';

        return {
          id: `api-${prod.id}`,
          name: prod.title,
          description: prod.description,
          price: Math.floor(prod.price * 0.9), // Petit ajustement de prix réaliste
          image: prod.thumbnail,
          category: appCategory,
          brand: prod.brand || 'Générique',
          rating: prod.rating || 4.5,
          isPromo: prod.discountPercentage > 12,
          featured: prod.rating >= 4.5
        };
      });
    },
    staleTime: 1000 * 60 * 5, // Garde les données fraîches pendant 5 minutes
  });
}
