import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { openStripeCheckout } from '../lib/stripe';
import { formatPrice } from '../utils/format';
import { FREE_SHIPPING_THRESHOLD } from '../stores/cartStore';

export function Cart() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    shippingCost,
    grandTotal,
    totalItems,
  } = useCart();

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Votre panier</h1>
      {items.length === 0 ? (
        <div className="card-coolblue p-12 text-center">
          <p className="text-muted mb-4">Votre panier est vide</p>
          <Link to="/catalogue" className="btn-primary inline-block">
            Continuer vos achats
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card-coolblue p-4 flex gap-4">
                <div className="w-24 h-24 bg-image-bg rounded flex items-center justify-center flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-primary font-extrabold mt-1">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 border rounded"
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 border rounded"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-danger"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-primary">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="card-coolblue p-6 sticky top-36">
              <h2 className="font-bold mb-4">
                Récapitulatif ({totalItems} articles)
              </h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-success">Gratuite</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-muted mb-4">
                  Plus que {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} pour la
                  livraison gratuite
                </p>
              )}
              <button
                type="button"
                onClick={openStripeCheckout}
                className="btn-primary w-full py-3"
              >
                Commander
              </button>
              <p className="text-xs text-success text-center mt-3">
                ✓ Livraison gratuite dès 30€
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
