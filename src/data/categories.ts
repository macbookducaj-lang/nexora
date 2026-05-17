import type { CategoryConfig } from '../types';

export const NAV_CATEGORIES = [
  'Téléphones',
  'TV & Audio',
  'Ordinateurs',
  'Gaming',
  'Électroménager',
  'Cuisine',
  'Nettoyage & Vapeur',
  'Photo & Vidéo',
  'Audio',
  'Accessoires',
  'Promotions',
] as const;

export const HOME_CATEGORIES: CategoryConfig[] = [
  { name: 'Téléphones', slug: 'telephones', emoji: '📱' },
  { name: 'Ordinateurs', slug: 'ordinateurs', emoji: '💻' },
  { name: 'Gaming', slug: 'gaming', emoji: '🎮' },
  { name: 'TV & Audio', slug: 'tv-audio', emoji: '📺' },
  { name: 'Électroménager', slug: 'electromenager', emoji: '🍳' },
  { name: 'Nettoyage', slug: 'nettoyage-vapeur', emoji: '🧹' },
  { name: 'Photo', slug: 'photo-video', emoji: '📷' },
  { name: 'Audio', slug: 'audio', emoji: '🎧' },
  { name: 'Accessoires', slug: 'accessoires', emoji: '⌨️' },
  { name: 'Imprimantes', slug: 'imprimantes', emoji: '🖨️' },
  { name: 'Maison', slug: 'maison', emoji: '🏠' },
  { name: 'Câbles & Prises', slug: 'cables', emoji: '🔌' },
];

export const BRANDS = [
  'Samsung',
  'Apple',
  'LG',
  'Sony',
  'Philips',
  'Bosch',
  'Dyson',
  'Polti',
  'HP',
  'Lenovo',
];

export function slugToCategoryName(slug: string): string {
  const found = HOME_CATEGORIES.find((c) => c.slug === slug);
  if (found) return found.name;
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
