export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  imageUrl: string;
  images?: string[];
  category: string;
  categorySlug: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isActive: boolean;
  isFeatured?: boolean;
  badges?: string[];
  specs?: Record<string, string>;
  deliveryInfo?: string;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  brand?: string;
  category?: string;
}

export interface UserAddress {
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface UserProfile {
  email: string;
  fullName?: string;
  phone?: string;
  address?: UserAddress;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  stripeSessionId?: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  items: OrderItem[];
  total: number;
  subtotal: number;
  shippingCost: number;
  shippingAddress?: UserAddress;
  createdAt: string;
}

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest';

export type ViewMode = 'grid' | 'list';

export interface CategoryConfig {
  name: string;
  slug: string;
  emoji: string;
}
