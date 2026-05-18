import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

const PRODUCTS_KEY = ['products'] as const;

const staticTechProducts: any[] = [
  {
    id: 1,
    name: 'ASUS Vivobook 15 - Intel Core i7 - 16 Go RAM - 512 Go SSD',
    description: 'Ordinateur portable performant et polyvalent. Parfait pour le développement, la bureautique et le divertissement. Écran 15.6" Full HD avec traitement anti-reflets.',
    price: 749,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    category: 'ordinateurs',
    brand: 'ASUS',
    rating: 4.7,
    isPromo: true,
    featured: true,
    stock: 45,
    inStock: true,
    quantity: 45
  },
  {
    id: 2,
    name: 'Apple MacBook Air 13" Puce M3 - 8 Go - 256 Go SSD - Noir Minuit',
    description: 'Le MacBook Air avec puce M3 ultra-rapide. Design ultra-fin, boîtier en aluminium 100% recyclé et autonomie incroyable allant jusqu\'à 18 heures.',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    category: 'ordinateurs',
    brand: 'Apple',
    rating: 4.9,
    isPromo: false,
    featured: true,
    stock: 15,
    inStock: true,
    quantity: 15
  },
  {
    id: 3,
    name: 'iPhone 15 Pro 128 Go - Titane Naturel',
    description: 'Le tout premier iPhone avec un design en titane de qualité aérospatiale, puce A17 Pro révolutionnaire et un système photo encore plus puissant.',
    price: 1049,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    category: 'téléphones',
    brand: 'Apple',
    rating: 4.8,
    isPromo: false,
    featured: true,
    stock: 22,
    inStock: true,
    quantity: 22
  },
  {
    id: 4,
    name: 'Samsung Galaxy S24 Ultra 256 Go - Noir Titane',
    description: 'Découvrez l\'ère de l\'intelligence mobile avec Galaxy AI. Cadre en titane élégant, stylet S Pen intégré et capteur photo exceptionnel de 200 Mpx.',
    price: 1249,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    category: 'téléphones',
    brand: 'Samsung',
    rating: 4.7,
    isPromo: true,
    featured: false,
    stock: 35,
    inStock: true,
    quantity: 35
  },
  {
    id: 5,
    name: 'Sony WH-1000XM5 Casque Sans-fil à Réduction de Bruit Active',
    description: 'Casque audio circum-aural avec réduction de bruit sans précédent, un son haute résolution exceptionnel et un confort absolu.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    category: 'audio',
    brand: 'Sony',
    rating: 4.9,
    isPromo: true,
    featured: true,
    stock: 60,
    inStock: true,
    quantity: 60
  },
  {
    id: 6,
    name: 'Logitech MX Master 3S Souris Sans-Fil Haute Précision',
    description: 'La souris ergonomique emblématique réinventée pour une précision et une réactivité instantanées. Idéale pour la productivité.',
    price: 109,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    category: 'accessoires',
    brand: 'Logitech',
    rating: 4.8,
    isPromo: false,
    featured: true,
    stock: 120,
    inStock: true,
    quantity: 120
  },
  {
    id: 7,
    name: 'Samsung QLED 4K 55" Smart TV',
    description: 'Une qualité d\'image éclatante avec des contrastes saisissants grâce à la technologie QLED. Accédez à toutes vos applications de streaming.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    category: 'tv & audio',
    brand: 'Samsung',
    rating: 4.6,
    isPromo: true,
    featured: true,
    stock: 14,
    inStock: true,
    quantity: 14
  }
];

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async (): Promise<Product[]> => {
      return staticTechProducts;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Correction majeure : On renvoie TOUSTES les structures possibles (tableau direct et propriétés d'objet)
// pour qu'aucun composant (Category ou Catalogue) ne crash sur un itérable
export function useProductsByCategory(categorySlug: string | undefined) {
  const { data: products = [], isLoading, error } = useProducts();
  
  const filtered = categorySlug && categorySlug.toLowerCase() !== 'all'
    ? products.filter(p => p.category.toLowerCase() === categorySlug.toLowerCase())
    : products;

  // On crée un tableau hybride qui porte aussi les propriétés d'un objet pour satisfaire tous les types d'imports !
  const result: any = [...filtered];
  result.data = filtered;
  result.isLoading = isLoading;
  result.error = error;

  return result;
}

export function filterAndSortProducts(
  products: Product[],
  category: string | null,
  brand: string | null,
  search: string | null,
  sort: string | null,
  promo: string | null
): Product[] {
  // Sécurité si les produits reçus ne sont pas un tableau direct
  const targetProducts = Array.isArray(products) ? products : ((products as any).data || []);
  let result = [...targetProducts];

  if (category && category.toLowerCase() !== 'all' && category !== '') {
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
