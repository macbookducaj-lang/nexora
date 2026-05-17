import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CategoryMenu } from './CategoryMenu';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { NAV_CATEGORIES, categoryToSlug } from '../data/categories';

interface HeaderProps {
  onAuthClick: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { totalItems, openCart } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-border">
        <div className="max-w-container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="w-9 h-9 bg-primary rounded-md flex items-center justify-center text-white font-extrabold text-lg">
              N
            </span>
            <span className="text-xl font-extrabold text-primary tracking-tight">
              nexora.
            </span>
          </Link>

          <SearchBar className="hidden md:flex flex-1 max-w-[65%] mx-auto" />

          <div className="flex items-center gap-3 ml-auto">
            <div className="relative hidden sm:block" ref={accountRef}>
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex flex-col items-center text-xs hover:text-primary transition-colors"
                  >
                    <User size={22} />
                    <span className="flex items-center gap-0.5">
                      Mon compte <ChevronDown size={12} />
                    </span>
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-card py-2 z-50">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm hover:bg-page"
                        onClick={() => setAccountOpen(false)}
                      >
                        Mon profil
                      </Link>
                      <Link
                        to="/account/commandes"
                        className="block px-4 py-2 text-sm hover:bg-page"
                        onClick={() => setAccountOpen(false)}
                      >
                        Mes commandes
                      </Link>
                      <Link
                        to="/account/favoris"
                        className="block px-4 py-2 text-sm hover:bg-page"
                        onClick={() => setAccountOpen(false)}
                      >
                        Mes favoris
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          signOut();
                          setAccountOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-page"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={onAuthClick}
                  className="flex flex-col items-center text-xs hover:text-primary transition-colors"
                >
                  <User size={22} />
                  <span>Mon compte</span>
                </button>
              )}
            </div>

            <Link
              to="/account/favoris"
              className="hidden sm:flex flex-col items-center text-xs hover:text-primary transition-colors"
            >
              <Heart size={22} />
              <span>Favoris</span>
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="flex flex-col items-center text-xs hover:text-primary transition-colors relative"
            >
              <ShoppingCart size={22} />
              <span>Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Menu"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <SearchBar className="md:hidden px-4 pb-3" />
      </div>

      <CategoryMenu />

      {mobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenu(false)}
            role="presentation"
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-primary text-white p-6 overflow-y-auto">
            <button type="button" className="mb-6" onClick={() => setMobileMenu(false)}>
              <X size={24} />
            </button>
            <ul className="space-y-3">
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/categorie/${categoryToSlug(cat)}`}
                    onClick={() => setMobileMenu(false)}
                    className="text-lg hover:underline"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
