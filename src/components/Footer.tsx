import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="max-w-container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-white rounded text-primary font-extrabold flex items-center justify-center">
                N
              </span>
              <span className="font-extrabold text-lg">nexora.</span>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Marketplace généraliste : TV, smartphones, ordinateurs, électroménager, gaming et plus encore.
            </p>
            <div className="flex gap-3">
              <Facebook size={20} className="opacity-80 hover:opacity-100 cursor-pointer" />
              <Instagram size={20} className="opacity-80 hover:opacity-100 cursor-pointer" />
              <Twitter size={20} className="opacity-80 hover:opacity-100 cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-3">Boutique</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/catalogue" className="hover:underline">Catalogue</Link></li>
              <li><Link to="/catalogue?promo=1" className="hover:underline">Promotions</Link></li>
              <li><Link to="/catalogue?sort=newest" className="hover:underline">Nouveautés</Link></li>
              <li><Link to="/catalogue" className="hover:underline">Marques</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Service client</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Livraison</li>
              <li>Retours</li>
              <li>Garantie 2 ans</li>
              <li>Contact</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Newsletter</h4>
            <p className="text-sm text-white/80 mb-3">Recevez nos offres exclusives</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 rounded px-3 py-2 text-primary text-sm"
              />
              <button type="submit" className="bg-white text-primary font-bold px-4 py-2 rounded text-sm hover:bg-category-hover transition-colors">
                S&apos;abonner
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <span>© {new Date().getFullYear()} NEXORA. Tous droits réservés.</span>
          <span>Mentions légales · CGV · Confidentialité</span>
          <span className="flex gap-2 items-center">Visa · Mastercard · Stripe</span>
        </div>
      </div>
    </footer>
  );
}
