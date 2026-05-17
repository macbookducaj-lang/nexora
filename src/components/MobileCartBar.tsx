import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';

export function MobileCartBar() {
  const { totalItems, subtotal, openCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-primary text-white p-3 flex items-center justify-between shadow-lg">
      <button type="button" onClick={openCart} className="flex-1 text-left">
        <span className="font-bold">
          {totalItems} article{totalItems > 1 ? 's' : ''}
        </span>
        <span className="block text-sm text-white/80">{formatPrice(subtotal)}</span>
      </button>
      <button
        type="button"
        onClick={openCart}
        className="bg-white text-primary font-bold px-4 py-2 rounded"
      >
        Panier
      </button>
    </div>
  );
}
