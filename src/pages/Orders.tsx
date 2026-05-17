import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { formatPrice } from '../utils/format';

const statusColors: Record<string, string> = {
  pending: 'text-orange',
  paid: 'text-success',
  shipped: 'text-primary',
  delivered: 'text-success',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
};

export function Orders() {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useOrders(user?.uid);

  const list = user
    ? orders
    : (JSON.parse(localStorage.getItem('nexora-orders') || '[]') as typeof orders);

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <nav className="text-sm text-muted mb-4">
        <Link to="/account" className="hover:text-primary">
          Mon compte
        </Link>
        {' > '}
        <span>Mes commandes</span>
      </nav>
      <h1 className="text-2xl font-bold mb-6">Mes commandes</h1>

      {isLoading ? (
        <p className="text-muted">Chargement...</p>
      ) : list.length === 0 ? (
        <div className="card-coolblue p-8 text-center text-muted">
          Aucune commande pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((order) => (
            <div key={order.id} className="card-coolblue p-4">
              <div className="flex flex-wrap justify-between gap-2 mb-3">
                <span className="font-bold">Commande #{order.id.slice(0, 8)}</span>
                <span
                  className={`font-semibold text-sm ${statusColors[order.status] ?? ''}`}
                >
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>
              <p className="text-sm text-muted mb-2">
                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
              </p>
              <p className="font-extrabold text-primary">
                {formatPrice(order.total)}
              </p>
              <ul className="mt-3 text-sm text-muted space-y-1">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
