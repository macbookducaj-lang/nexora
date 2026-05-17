import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Package, Heart, MapPin, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MENU = [
  { id: 'profile', label: 'Mon profil', icon: User, path: '/account' },
  { id: 'orders', label: 'Mes commandes', icon: Package, path: '/account/commandes' },
  { id: 'favorites', label: 'Mes favoris', icon: Heart, path: '/account/favoris' },
  { id: 'security', label: 'Sécurité', icon: Shield, path: '/account#security' },
] as const;

export function Account() {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  const active = location.pathname.includes('commandes')
    ? 'orders'
    : location.pathname.includes('favoris')
      ? 'favorites'
      : location.hash === '#security'
        ? 'security'
        : 'profile';

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName ?? '');
      setPhone(profile.phone ?? '');
      setStreet(profile.address?.street ?? '');
      setCity(profile.address?.city ?? '');
      setZip(profile.address?.zip ?? '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    await updateProfile({
      fullName,
      phone,
      address: { street, city, zip, country: 'France' },
    });
    alert('Profil mis à jour');
  };

  if (loading) return <p className="text-center py-12">Chargement...</p>;

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="card-coolblue p-6 h-fit">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(profile?.fullName?.[0] ?? user?.email?.[0] ?? 'N').toUpperCase()}
            </div>
            <p className="font-bold mt-2">{profile?.fullName || 'Invité'}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
          <nav className="space-y-1">
            {MENU.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm ${
                  active === id
                    ? 'bg-category-hover text-primary font-semibold'
                    : 'hover:bg-page'
                }`}
              >
                <Icon size={18} /> {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-danger hover:bg-red-50 mt-4"
            >
              <LogOut size={18} /> Déconnexion
            </button>
          </nav>
        </aside>

        <div className="md:col-span-3 card-coolblue p-6">
          {active === 'profile' && (
            <>
              <h2 className="text-xl font-bold mb-4">Mon profil</h2>
              <div className="space-y-4 max-w-lg">
                <label className="block">
                  <span className="text-sm font-medium">Nom complet</span>
                  <input
                    className="input-coolblue mt-1"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Téléphone</span>
                  <input
                    className="input-coolblue mt-1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <h3 className="font-bold pt-2 flex items-center gap-2">
                  <MapPin size={18} /> Adresse de livraison
                </h3>
                <input
                  className="input-coolblue"
                  placeholder="Rue"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="input-coolblue"
                    placeholder="Ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <input
                    className="input-coolblue"
                    placeholder="Code postal"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
                <button type="button" onClick={handleSaveProfile} className="btn-primary">
                  Enregistrer
                </button>
              </div>
            </>
          )}
          {active === 'security' && (
            <>
              <h2 className="text-xl font-bold mb-4">Sécurité</h2>
              <p className="text-muted text-sm">
                Pour changer votre mot de passe, utilisez « Mot de passe oublié » sur la
                page de connexion.
              </p>
            </>
          )}
          {(active === 'orders' || active === 'favorites') && (
            <p className="text-muted">Utilisez le menu pour accéder à cette section.</p>
          )}
        </div>
      </div>
    </div>
  );
}
