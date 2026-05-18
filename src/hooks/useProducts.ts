import { Product } from '../types';

const staticTechProducts: Product[] = [
  {
    id: 'cb-pc-1' as any,
    name: 'ASUS Vivobook 15 - Intel Core i7 - 16 Go RAM - 512 Go SSD',
    description: 'Ordinateur portable performant et polyvalent. Parfait pour le développement, la bureautique et le divertissement.',
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
    id: 'cb-pc-2' as any,
    name: 'Apple MacBook Air 13" Puce M3 - 8 Go - 256 Go SSD',
    description: 'Le MacBook Air avec puce M3 ultra-rapide. Design ultra-fin et autonomie incroyable allant jusqu\'à 18 heures.',
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
    id: 'cb-tel-1' as any,
    name: 'iPhone 15 Pro 128 Go - Titane Naturel',
    description: 'Le tout premier iPhone avec un design en titane de qualité aérospatiale, puce A17 Pro révolutionnaire.',
    price: 1049,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    category: 'téléphones',
    brand: 'Apple',
    rating: 4.8,
    isPromo: true,
    featured: true,
    stock: 22,
    inStock: true,
    quantity: 22
  },
  {
    id: 'cb-tel-2' as any,
    name: 'Samsung Galaxy S24 Ultra 256 Go - Noir Titane',
    description: 'Découvrez l\'ère de l\'intelligence mobile avec Galaxy AI. Cadre en titane élégant et stylet S Pen intégré.',
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
    id: 'cb-acc-1' as any,
    name: 'Sony WH-1000XM5 Casque Sans-fil',
    description: 'Casque audio avec réduction de bruit sans précédent, un son haute résolution exceptionnel.',
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
    id: 'cb-acc-2' as any,
    name: 'Logitech MX Master 3S Souris Sans-Fil',
    description: 'La souris ergonomique emblématique réinventée pour une précision et une réactivité instantanées.',
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
    id: 'cb-tv-1' as any,
    name: 'Samsung QLED 4K 55" Smart TV',
    description: 'Une qualité d\'image éclatante avec des contrastes saisissants grâce à la technologie QLED.',
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

// On imite la structure exacte retournée par useQuery pour que TOUTES les syntaxes fonctionnent
export function useProducts() {
  return {
    data: staticTechProducts,
    isLoading: false,
    error: null,
    isSuccess: true
  };
}

export function useProductsByCategory(categorySlug: string | undefined) {
  const filtered = categorySlug && categorySlug.toLowerCase() !== 'all'
    ? staticTechProducts.filter(p => p.category.toLowerCase() === categorySlug.toLowerCase())
    : staticTechProducts;

  return {
    data: filtered,
    isLoading: false,
    error: null,
    isSuccess: true
  };
}

export function filterAndSortProducts(
  products: any,
  category: string | null,
  brand: string | null,
  search: string | null,
  sort: string | null,
  promo: string | null
): Product[] {
  // On extrait le tableau que ce soit un tableau brut ou l'objet .data
  const targetArray = Array.isArray(products) ? products : (products?.data || staticTechProducts);
  let result = [...targetArray];

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
