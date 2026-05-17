import { Link } from 'react-router-dom';
import { Heart, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { Stars } from './Stars';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { formatPrice, formatRating } from '../utils/format';
import { cn } from '../utils/cn';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  listView?: boolean;
  index?: number;
}

export function ProductCard({ product, listView = false, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(product.id);
  const inStock = product.stock > 0;
  const hasPromo =
    product.comparePrice != null && product.comparePrice > product.price;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      brand: product.brand,
      category: product.category,
    });
    toast.success('Ajouté au panier ✓');
  };

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    toast.success(fav ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const cardClass = cn(
    'card-coolblue flex h-full hover:border-primary overflow-hidden group animate-fade-in-up',
    listView ? 'flex-row gap-4 p-4' : 'flex-col'
  );

  const style = { animationDelay: `${index * 50}ms` } as React.CSSProperties;

  const imageBlock = (
    <div
      className={cn(
        'relative bg-image-bg flex items-center justify-center',
        listView ? 'w-[120px] h-[120px] flex-shrink-0 rounded' : 'h-[200px] p-4'
      )}
    >
      {(hasPromo || product.badges?.includes('Promo')) && (
        <span className="absolute top-2 left-2 bg-orange text-white text-xs font-bold px-2 py-1 rounded z-10">
          PROMO
        </span>
      )}
      <img
        src={product.imageUrl}
        alt={product.name}
        loading="lazy"
        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-150"
        onLoad={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        style={{ opacity: 0, transition: 'opacity 0.3s' }}
      />
    </div>
  );

  const infoBlock = (
    <div className={cn('flex flex-col flex-1', listView ? '' : 'p-4')}>
      <h3 className="text-sm text-[#1A1A1A] line-clamp-2 min-h-[40px] font-medium">
        {product.name}
      </h3>
      <div className="flex items-center gap-2 mt-2">
        <Stars rating={product.rating} />
        <span className="text-xs text-muted">
          {formatRating(product.rating)} ({product.reviewCount} avis)
        </span>
      </div>
      <div className="mt-3">
        <p className="text-[22px] font-extrabold text-primary">
          {formatPrice(product.price)}
        </p>
        {hasPromo && (
          <p className="text-sm text-muted line-through">
            {formatPrice(product.comparePrice!)}
          </p>
        )}
      </div>
      <div className="mt-2 space-y-1">
        {product.deliveryInfo && (
          <p className="text-xs text-success flex items-center gap-1">
            <Truck size={12} /> {product.deliveryInfo}
          </p>
        )}
        <p className={cn('text-xs', inStock ? 'text-success' : 'text-danger')}>
          {inStock ? '✓ En stock' : 'Rupture de stock'}
        </p>
      </div>
      <div className={cn('flex gap-2 mt-auto', listView ? 'mt-4' : 'pt-4')}>
        <button
          type="button"
          onClick={handleFav}
          className={cn(
            'flex items-center justify-center border border-border rounded h-10 w-10 hover:border-primary transition-colors',
            fav && 'text-danger border-danger'
          )}
          aria-label="Favoris"
        >
          <Heart size={18} className={fav ? 'fill-danger' : ''} />
        </button>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inStock}
          className="flex-1 bg-primary text-white font-semibold h-10 rounded hover:bg-primary-hover transition-colors duration-150 disabled:opacity-50 text-sm"
        >
          + Au panier
        </button>
      </div>
    </div>
  );

  return (
    <Link
      to={`/produit/${product.id}`}
      className={cardClass}
      style={style}
    >
      {imageBlock}
      {infoBlock}
    </Link>
  );
}
