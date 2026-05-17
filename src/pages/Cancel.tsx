import { Link } from 'react-router-dom';

export function Cancel() {
  return (
    <div className="max-w-container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-danger mb-3">Paiement annulé</h1>
      <p className="text-muted mb-8">
        Votre commande n&apos;a pas été finalisée. Vos articles sont toujours dans votre panier.
      </p>
      <Link to="/panier" className="btn-primary inline-block">
        Retour au panier
      </Link>
    </div>
  );
}
