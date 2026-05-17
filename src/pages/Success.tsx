import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCreateOrder } from '../hooks/useOrders';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';

export function Success() {
  const { user } = useAuth();
  const { mutate: createOrder } = useCreateOrder();
  const { items, subtotal, shippingCost, grandTotal, clearCart } = useCart();

  useEffect(() => {
    const pending = localStorage.getItem('nexora-pending-order');
    if (pending) return;

    if (items.length === 0) return;

    const orderData = {
      userId: user?.uid ?? 'guest',
      status: 'paid' as const,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        imageUrl: i.imageUrl,
        quantity: i.quantity,
      })),
      subtotal,
      shippingCost,
      total: grandTotal,
    };

    createOrder(orderData);
    localStorage.setItem('nexora-pending-order', JSON.stringify(orderData));
    clearCart();
  }, []);

  const summary = JSON.parse(
    localStorage.getItem('nexora-pending-order') || 'null'
  );

  return (
    <div className="max-w-container mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-24 h-24 text-success mx-auto mb-6 animate-check-pop" />
      <h1 className="text-3xl font-bold text-primary mb-3">
        Merci pour votre commande !
      </h1>
      <p className="text-muted mb-8 max-w-md mx-auto">
        Votre paiement a été confirmé. Vous recevrez un email de confirmation sous peu.
      </p>
      {summary && (
        <div className="card-coolblue p-6 max-w-md mx-auto mb-8 text-left">
          <h2 className="font-bold mb-3">Résumé</h2>
          <ul className="text-sm space-y-1 mb-3">
            {summary.items?.map((item: { name: string; quantity: number }) => (
              <li key={item.name}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="font-extrabold text-primary text-lg">
            Total : {formatPrice(summary.total ?? 0)}
          </p>
        </div>
      )}
      <Link to="/account/commandes" className="btn-primary inline-block">
        Voir mes commandes
      </Link>
    </div>
  );
}
