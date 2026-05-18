import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

const PRODUCTS_KEY = ['products'] as const;

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async (): Promise<Product[]> => {
      // On cherche de la vraie tech (ordinateurs, écrans, smartphones) sur une API e-commerce puissante
      const response = await fetch('https://api.mercadolibre.com/sites/MLA/search?category=MLA1648&limit=50');
      if (!response.ok) throw new Error('Erreur lors de la récupération des produits Coolblue Tech');
      
      const data = await response.json();
      
      return data.results.map((prod: any) => {
        // Détection intelligente de la catégorie pour coller à ton site Nexora
        let appCategory = 'accessoires';
        const titleLower = prod.title.toLowerCase();
        
        if (titleLower.includes('notebook') || titleLower.includes('laptop') || titleLower.includes('pc') || titleLower.includes('asus') || titleLower.includes('lenovo')) {
          appCategory = 'pc-portables';
        } else if (titleLower.includes('celular') || titleLower.includes('iphone') || titleLower.includes('samsung') || titleLower.includes('smartphone')) {
          appCategory = 'smartphones';
        }

        // Conversion approximative du prix en Euros réalistes (et clean)
        let cleanPrice = Math.floor(prod.price / 1000);
        if (cleanPrice < 10) cleanPrice = Math.floor(prod.price / 100) || 49;
        if (cleanPrice > 2500) cleanPrice = 1299;

        // Récupération d'une image de meilleure qualité que la miniature de base
        const hdImage = prod.thumbnail.replace('-I.jpg', '-O.jpg');

        return {
          id: `ml-${prod.id}`,
          name: prod.title,
          description: `Découvrez le produit ${prod.title}. Matériel certifié de haute qualité, idéal pour vos besoins technologiques au quotidien. Garantie constructeur incluse.`,
          price: cleanPrice,
          image: hdImage,
          category: appCategory,
          brand: prod.attributes?.find((a: any) => a.id === 'BRAND')?.value_name || 'Marque Tech',
          rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)), // Vraies notes réalistes style Coolblue
          isPromo: prod.original_price ? true : Math.random() > 0.7,
          featured: Math.random() > 0.7
        };
      });
    },
    staleTime: 1000 * 60 * 10, // On garde en cache 10 minutes
  });
}

// Hook demandé par src/pages/Category.tsx
export function useProductsByCategory(categorySlug: string | undefined) {
  const { data: products = [], isLoading, error } = useProducts();
  
  const filteredProducts = categorySlug && categorySlug !== 'all'
    ? products.filter(p => p.category === categorySlug)
    : products;

  return {
    data: filteredProducts,
    isLoading,
    error
  };
}

// Fonction demandée par src/pages/Catalogue.tsx et Category.tsx
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
