import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="max-w-container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-coolblue mb-4">404</h1>
      <p className="text-text-secondary mb-8">Page introuvable</p>
      <Link to="/" className="btn-primary inline-block">Retour à l&apos;accueil</Link>
    </div>
  );
}
