import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Truck, RotateCcw, Shield, MessageCircle } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/ProductGrid';
import { HOME_CATEGORIES, BRANDS } from '../data/categories';

function SectionHeader({
  title,
  subtitle,
  linkTo,
  badge,
}: {
  title: string;
  subtitle?: string;
  linkTo: string;
  badge?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        {badge && (
          <span className="inline-block bg-danger text-white text-xs font-bold px-2 py-0.5 rounded mb-2">
            {badge}
          </span>
        )}
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted text-sm">{subtitle}</p>}
      </div>
      <Link
        to={linkTo}
        className="text-primary font-semibold hover:underline flex items-center gap-1"
      >
        Voir tout <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export function Index() {
  const navigate = useNavigate();
  const { products, loading, getFeatured, getPromos, getNew } = useProducts();

  const featured = getFeatured();
  const promos = getPromos();
  const newest = getNew();

  return (
    <>
      <section
        className="relative h-[260px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #003082 0%, #0059A3 100%)',
        }}
      >
        <div className="max-w-container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Bienvenue chez Nexora
            </h1>
            <p className="text-white/90 mb-4">
              Les meilleures marques au meilleur prix
            </p>
            <p className="text-sm text-white/80 mb-6">
              ✓ Livraison gratuite dès 30€ · ✓ Retour 30 jours · ✓ Paiement sécurisé
            </p>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded hover:bg-category-hover transition-colors"
            >
              Voir tout le catalogue <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&h=400&fit=crop"
          alt=""
          className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-25 hidden lg:block"
        />
      </section>

      <section className="bg-white py-8 border-b border-border">
        <div className="max-w-container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {HOME_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/categorie/${cat.slug}`}
                className="card-coolblue flex flex-col items-center gap-2 p-4 hover:border-primary hover:bg-category-hover transition-colors duration-150 text-center"
              >
                <span className="text-4xl" role="img" aria-hidden>
                  {cat.emoji}
                </span>
                <span className="text-[13px] font-semibold text-primary">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-container mx-auto px-4 py-10">
        <SectionHeader title="Meilleures ventes" linkTo="/catalogue" />
        <ProductGrid products={featured} loading={loading} />
      </section>

      <section className="max-w-container mx-auto px-4 py-10">
        <SectionHeader
          title="🔥 Promotions"
          subtitle={`${promos.length} offres en cours`}
          linkTo="/catalogue?promo=1"
          badge={`${promos.length} promos`}
        />
        <ProductGrid products={promos} loading={loading} />
      </section>

      <section className="max-w-container mx-auto px-4 py-10">
        <SectionHeader title="Nouveautés" linkTo="/catalogue?sort=newest" />
        <ProductGrid products={newest} loading={loading} />
      </section>

      <section className="bg-white py-8 border-y border-border">
        <div className="max-w-container mx-auto px-4">
          <h3 className="text-center font-bold text-muted mb-6">
            Nos marques partenaires
          </h3>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {BRANDS.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() =>
                  navigate(`/catalogue?brand=${encodeURIComponent(brand)}`)
                }
                className="text-xl font-bold text-gray-300 hover:text-primary transition-colors"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Truck, text: 'Livraison gratuite dès 30€' },
            { icon: RotateCcw, text: 'Retour gratuit 30 jours' },
            { icon: Shield, text: 'Garantie 2 ans incluse' },
            { icon: MessageCircle, text: 'Service client 7j/7' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center text-center gap-2">
              <Icon className="text-primary" size={32} />
              <p className="text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
