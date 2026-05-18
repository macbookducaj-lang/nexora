import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

const PRODUCTS_KEY = ['products'] as const;

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async (): Promise<Product[]> => {
      let apiProducts: any[] = [];
      
      try {
        const response = await fetch('https://fakestoreapi.com/products/category/electronics');
        if (response.ok) {
          apiProducts = await response.json();
        }
      } catch (e) {
        console.warn("L'API externe n'a pas répondu à temps.");
      }

      // 1. Conversion des produits de l'API Fakestore
      const formattedApi = apiProducts.map((prod: any) => {
        let cat = 'accessoires';
        const titleLower = prod.title.toLowerCase();
        
        if (titleLower.includes('monitor') || titleLower.includes('screen') || titleLower.includes('tv')) {
          cat = 'tv & audio';
        } else if (titleLower.includes('drive') || titleLower.includes('ssd') || titleLower.includes('hard drive')) {
          cat = 'accessoires'; 
        }

        return {
          id: `fake-${prod.id}`,
          name: prod.title,
          description: prod.description,
          price: Math.floor(prod.price),
          image: prod.image,
          category: cat,
          brand: 'Tech Pro',
          rating: prod.rating?.rate || 4.4,
          isPromo: prod.id % 2 === 0,
          featured: prod.rating?.rate >= 4.5,
          stock: 50,
          inStock: true,
          quantity: 50
        };
      });

      // 2. Catalogue Premium Coolblue
      const coolblueProducts: Product[] = [
        {
          id: 'cb-pc-1',
          name: 'ASUS Vivobook 15 - Intel Core i7 - 16 Go RAM - 512 Go SSD',
          description: 'Ordinateur portable ultra-fin et performant, idéal pour le multitâche. Écran Full HD anti-reflets.',
          price: 749,
          image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
          category: 'ordinateurs',
          brand: 'ASUS',
          rating: 4.7,
          isPromo: true,
          featured: true,
          stock: 25,
          inStock: true
        },
        {
          id: 'cb-pc-2',
          name: 'Apple MacBook Air 13" Puce M3 - 8 Go - 256 Go SSD',
          description: 'Le portable le plus populaire d\'Apple avec la surpuissante puce M3. Autonomie incroyable de 18 heures.',
          price: 1199,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
          category: 'ordinateurs',
          brand: 'Apple',
          rating: 4.9,
          isPromo: false,
          featured: true,
          stock: 12,
          inStock: true
        },
        {
          id: 'cb-tel-1',
          name: 'iPhone 15 Pro 128 Go - Titane Naturel',
          description: 'Design robuste et léger en titane de qualité aérospatiale. Puce A17 Pro révolutionnaire.',
          price: 1049,
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
          category: 'téléphones',
          brand: 'Apple',
          rating: 4.8,
          isPromo: false,
          featured: true,
          stock: 18,
          inStock: true
        },
        {
          id: 'cb-tel-2',
          name: 'Samsung Galaxy S24 Ultra 256 Go',
          description: 'Bienvenue dans l\'ère de l\'accomplissement mobile avec Galaxy AI. Zoom optique exceptionnel.',
          price: 1249,
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
          category: 'téléphones',
          brand: 'Samsung',
          rating: 4.7,
          isPromo: true,
          featured: false,
          stock: 30,
          inStock: true
        },
        {
          id: 'cb-acc-1',
          name: 'Sony WH-1000XM5 Casque Sans-fil',
          description: 'La référence mondiale absolue du casque audio à réduction de bruit active.',
          price: 299,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
          category: 'audio',
          brand: 'Sony',
          rating: 4.9,
          isPromo: true,
          featured: true,
          stock: 40,
          inStock: true
        },
        {
          id: 'cb-acc-2',
          name: 'Logitech MX Master 3S Souris Sans-Fil',
          description: 'Souris ergonomique haute précision, idéale pour les développeurs et les créatifs.',
          price: 109,
          image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
          category: 'accessoires',
          brand: 'Logitech',
          rating: 4.8,
          isPromo: false,
          featured: true,
          stock: 100,
          inStock: true
        }
      ];

      return [...coolblueProducts, ...formattedApi];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductsByCategory(categorySlug: string | undefined) {
  const { data: products = [], isLoading, error } = useProducts();
  
  const filteredProducts = categorySlug && categorySlug.toLowerCase() !== 'all'
    ? products.filter(p => p.category.toLowerCase() === categorySlug.toLowerCase() || p.category.toLowerCase() === encodeURIComponent(categorySlug.toLowerCase()))
    : products;

  return {
    data: filteredProducts,
    isLoading,
    error
  };
}

export function filterAndSortProducts(
  products: Product[],
  category: string | null,
  brand: string | null,
  search: string | null,
  sort: string | null,
  promo: string | null
): Product[] {
  let result = [...products];

  // CORRECTION ICI : On ignore proprement le filtre si la catégorie vaut null ou 'all'
  if (category && category.toLowerCase() !== 'all') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
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
