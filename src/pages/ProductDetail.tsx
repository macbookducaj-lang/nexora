import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Truck, Minus, Plus, Lock, RotateCcw, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import { Stars } from '../components/Stars';
import { openStripeCheckout } from '../lib/stripe';
import { formatPrice } from '../utils/format';

export function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();

  if (isLoading) {
    return <p className="text-center py-12 text-muted">Chargement...</p>;
  }
  if (!product) {
    return <p className="text-center py-12">Produit introuvable</p>;
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl];

  const savings =
    product.comparePrice != null ? product.comparePrice - product.price : 0;
  const inStock = product.stock > 0;

  const handleAdd = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        brand: product.brand,
        category: product.category,
      },
      qty
    );
    toast.success('Ajouté au panier ✓');
  };

  const specs = product.specs
    ? Object.entries(product.specs)
    : [
        ['Marque', product.brand],
        ['Catégorie', product.category],
        ['Référence', product.id],
      ];

  return (
    <div className="max-w-container mx-auto px-4 py-6">
      <nav className="text-sm text-muted mb-6">
        <Link to="/" className="hover:text-primary">
          Accueil
        </Link>
        {' > '}
        <Link
          to={`/categorie/${product.categorySlug}`}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        {' > '}
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="card-coolblue p-4 mb-4 overflow-hidden group">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-[400px] object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 border-2 rounded bg-image-bg ${
                  activeImage === i ? 'border-primary' : 'border-border'
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
            {product.brand}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Stars rating={product.rating} size={16} />
            <span className="text-sm text-muted">
              {product.rating} ({product.reviewCount} avis)
            </span>
            <button type="button" className="text-sm text-primary hover:underline">
              Voir les avis
            </button>
          </div>
          <p className="text-muted mb-6 leading-relaxed">{product.description}</p>
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden mb-6">
            <tbody>
              {specs.map(([k, v], i) => (
                <tr key={k} className={i % 2 === 0 ? 'bg-page' : 'bg-white'}>
                  <td className="p-3 font-semibold w-1/3">{k}</td>
                  <td className="p-3">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="font-bold mb-2">Pourquoi choisir ce produit ?</h3>
          <ul className="space-y-2 text-sm text-success">
            <li>✓ Qualité {product.brand}</li>
            <li>✓ {product.deliveryInfo ?? 'Livraison rapide'}</li>
            <li>✓ Garantie constructeur 2 ans</li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="card-coolblue p-6 sticky top-36">
            <p className="text-[28px] font-extrabold text-primary">
              {formatPrice(product.price)}
            </p>
            {product.comparePrice != null && (
              <p className="text-muted line-through">
                {formatPrice(product.comparePrice)}
              </p>
            )}
            {savings > 0 && (
              <p className="text-success font-semibold text-sm mt-1">
                💚 Vous économisez {formatPrice(savings)}
              </p>
            )}
            <p className={`text-sm mt-4 ${inStock ? 'text-success' : 'text-danger'}`}>
              {inStock ? `✅ En stock (${product.stock} pcs)` : '❌ Rupture de stock'}
            </p>
            <p className="text-sm mt-2 flex items-start gap-2">
              <Truck size={16} className="text-orange flex-shrink-0 mt-0.5" />
              Livraison demain si commandé avant 23h00
            </p>
            <div className="flex items-center gap-3 my-6">
              <span className="text-sm font-medium">Quantité:</span>
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-2 border rounded"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="p-2 border rounded"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!inStock}
              className="btn-primary w-full py-3 mb-3 disabled:opacity-50"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              onClick={() => {
                handleAdd();
                openStripeCheckout();
              }}
              disabled={!inStock}
              className="btn-success w-full py-3 mb-4 disabled:opacity-50"
            >
              Acheter maintenant
            </button>
            <p className="text-xs text-muted flex items-center gap-2">
              <Lock size={14} /> Paiement sécurisé
            </p>
            <p className="text-xs text-muted flex items-center gap-2 mt-1">
              <RotateCcw size={14} /> Retour 30 jours
            </p>
            <p className="text-xs text-muted flex items-center gap-2 mt-1">
              <Shield size={14} /> Garantie 2 ans
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
