import { ProductCard } from './ProductCard';
import { cn } from '../utils/cn';
import type { Product } from '../types';
import type { ViewMode } from '../types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  view?: ViewMode;
  skeletonCount?: number;
}

function SkeletonCard() {
  return (
    <div className="card-coolblue overflow-hidden animate-pulse">
      <div className="h-[200px] bg-skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-skeleton rounded w-3/4" />
        <div className="h-3 bg-skeleton rounded w-1/2" />
        <div className="h-8 bg-skeleton rounded w-1/3 mt-4" />
        <div className="h-10 bg-skeleton rounded w-full" />
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  loading,
  view = 'grid',
  skeletonCount = 8,
}: ProductGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center py-16 text-muted">
        Aucun produit ne correspond à votre recherche.
      </p>
    );
  }

  return (
    <div
      className={cn(
        view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          listView={view === 'list'}
          index={index}
        />
      ))}
    </div>
  );
}
