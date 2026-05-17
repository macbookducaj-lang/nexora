# NEXORA — Marketplace généraliste (style Coolblue)

Marketplace e-commerce complète : TV, smartphones, ordinateurs, gaming, électroménager, etc.

## Stack

- React 18 + TypeScript + Vite
- TailwindCSS (design Coolblue)
- Firebase Auth + Firestore + Storage
- Zustand (panier persisté)
- TanStack Query (produits)
- Stripe Payment Links
- Sonner (toasts)

## Démarrage

```bash
cd nexora
npm install
npm run dev
```

Copiez `.env.example` vers `.env` et renseignez Firebase + Stripe.

## Données Firestore

Collection principale : **`products`** (tous les produits du site).

Sans Firebase configuré, 12 produits mock sont utilisés automatiquement.

### Structure `products`

```json
{
  "name": "Samsung Galaxy S24 128 Go",
  "slug": "samsung-galaxy-s24-128go",
  "price": 799.99,
  "comparePrice": 899.99,
  "imageUrl": "https://...",
  "category": "Téléphones",
  "categorySlug": "telephones",
  "brand": "Samsung",
  "rating": 4.5,
  "reviewCount": 128,
  "stock": 24,
  "isActive": true,
  "isFeatured": true
}
```

## Routes

| Route | Page |
|-------|------|
| `/` | Accueil (hero, catégories, ventes, promos, nouveautés) |
| `/catalogue` | Catalogue avec filtres |
| `/categorie/:slug` | Page catégorie |
| `/produit/:id` | Fiche produit |
| `/panier` | Panier |
| `/account` | Mon compte |
| `/account/commandes` | Commandes |
| `/account/favoris` | Favoris |
| `/success` | Confirmation paiement |

## Firebase

1. Créer un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activer Auth (Email + Google) et Firestore
3. Copier les clés dans `.env`
4. Importer vos produits dans la collection `products`
