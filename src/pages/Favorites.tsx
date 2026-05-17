import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useFavorites } from '../hooks/useFavorites';
import { ProductGrid } from '../components/ProductGrid';

export function Favorites() {
  const { products, loading } = useProducts();
  const { favoriteIds } = useFavorites();

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <nav className="text-sm text-muted mb-4">
        <Link to="/account" className="hover:text-primary">
          Mon compte
        </Link>
        {' > '}
        <span>Mes favoris</span>
      </nav>
      <h1 className="text-2xl font-bold mb-6">Mes favoris</h1>
      {favoriteProducts.length === 0 && !loading ? (
        <div className="card-coolblue p-12 text-center text-muted">
          <p className="mb-4">Aucun favori enregistré.</p>
          <Link to="/catalogue" className="btn-primary inline-block">
            Découvrir le catalogue
          </Link>
        </div>
      ) : (
        <ProductGrid products={favoriteProducts} loading={loading} />
      )}
    </div>
  );
}
