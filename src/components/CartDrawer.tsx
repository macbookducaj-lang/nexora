import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { openStripeCheckout } from '../lib/stripe';
import { formatPrice } from '../utils/format';
import { cn } from '../utils/cn';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    shippingCost,
    grandTotal,
    totalItems,
  } = useCart();
  const handleCheckout = async () => {
    try {
      const response = await fetch('https://nexora.macbookducaj.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }), 
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur Stripe : " + data.error);
      }
    } catch (error) {
      alert("Impossible de joindre le serveur de paiement.");
    }
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
        role="presentation"
      />
      <aside
        className={cn(
          'fixed right-0 top-0 bottom-0 w-full max-w-[400px] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-lg">
            Votre panier ({totalItems} article{totalItems > 1 ? 's' : ''})
          </h2>
          <button type="button" onClick={closeCart} aria-label="Fermer">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center py-8 text-muted">Votre panier est vide</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-border pb-4">
                <div className="w-20 h-20 bg-image-bg rounded flex items-center justify-center flex-shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                  <p className="text-primary font-extrabold mt-1">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 border border-border rounded hover:bg-page"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 border border-border rounded hover:bg-page"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-danger p-1"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Livraison</span>
              <span>
                {shippingCost === 0 ? (
                  <span className="text-success">Gratuite</span>
                ) : (
                  formatPrice(shippingCost)
                )}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatPrice(grandTotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => openStripeCheckout(items)}
              className="btn-primary w-full py-3 mt-2"
            >
              Commander
            </button>
            <p className="text-xs text-center text-muted">🔒 Paiement sécurisé Stripe</p>
            <Link
              to="/panier"
              onClick={closeCart}
              className="block text-center text-sm text-primary hover:underline"
            >
              Voir le panier complet
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}