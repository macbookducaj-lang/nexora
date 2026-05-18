import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

const PRODUCTS_KEY = ['products'] as const;

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async (): Promise<Product[]> => {
      let apiProducts: any[] = [];
      
      try {
        // API d'électronique ultra-fiable (ne bloque jamais en Europe)
        const response = await fetch('https://fakestoreapi.com/products/category/electronics');
        if (response.ok) {
          apiProducts = await response.json();
        }
      } catch (e) {
        console.warn("L'API externe a mis du temps à répondre, passage sur le catalogue direct.");
      }

      // Conversion des produits de l'API avec des images propres
      const formattedApi = apiProducts.map((prod: any) => ({
        id: `fake-${prod.id}`,
        name: prod.title,
        description: prod.description,
        price: Math.floor(prod.price),
        image: prod.image,
        category: 'accessoires',
        brand: 'Tech Pro',
        rating: prod.rating?.rate || 4.4,
        isPromo: prod.id % 2 === 0,
        featured: prod.rating?.rate >= 4.5
      }));

      // Vrais articles Tech style "Coolblue" (Haute Définition) pour remplir parfaitement tes catégories de l'Index
      const coolblueProducts: Product[] = [
        {
          id: 'cb-pc-1',
          name: 'ASUS Vivobook 15 - Intel Core i7 - 16 Go RAM - 512 Go SSD',
          description: 'Ordinateur portable ultra-fin et performant, idéal pour le multitâche, le développement et le divertissement au quotidien. Écran Full HD anti-reflets.',
          price: 749,
          image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
          category: 'pc-portables',
          brand: 'ASUS',
          rating: 4.7,
          isPromo: true,
          featured: true
        },
        {
          id: 'cb-pc-2',
          name: 'Apple MacBook Air 13" Puce M3 - 8 Go - 256 Go SSD - Noir Minuit',
          description: 'Le portable le plus populaire d\'Apple revient avec la surpuissante puce M3. Autonomie incroyable de 18 heures et design totalement silencieux.',
          price: 1199,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
          category: 'pc-portables',
          brand: 'Apple',
          rating: 4.9,
          isPromo: false,
          featured: true
        },
        {
          id: 'cb-tel-1',
          name: 'iPhone 15 Pro 128 Go - Titane Naturel',
          description: 'Design robuste et léger en titane de qualité aérospatiale. Puce A17 Pro révolutionnaire. Système de caméra ultra-puissant.',
          price: 1049,
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
          category: 'smartphones',
          brand: 'Apple',
          rating: 4.8,
          isPromo: false,
          featured: true
        },
        {
          id: 'cb-tel-2',
          name: 'Samsung Galaxy S24 Ultra 256 Go - Noir Titane',
          description: 'Bienvenue dans l\'ère de l\'accomplissement mobile avec Galaxy AI. Zoom optique exceptionnel et stylet S Pen intégré de série.',
          price: 1249,
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
          category: 'smartphones',
          brand: 'Samsung',
          rating: 4.7,
          isPromo: true,
          featured: false
        },
        {
          id: 'cb-acc-1',
          name: 'Sony WH-1000XM5 Casque Sans-fil à Réduction de Bruit',
          description: 'La référence mondiale absolue du casque audio à réduction de bruit active. Son haute résolution exceptionnel et confort longue durée.',
          price: 299,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          category: 'accessoires',
          brand: 'Sony',
          rating: 4.9,
          isPromo: true,
          featured: true
        }
      ];

      // On fusionne le tout pour avoir un catalogue riche et 100% visible
      return [...coolblueProducts, ...formattedApi];
    },
    staleTime: 1000 * 60 * 5,
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
