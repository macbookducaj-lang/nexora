import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Grid3x3, List } from 'lucide-react';
import { useProductsByCategory, filterAndSortProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/ProductGrid';
import { FilterSidebar, type FilterState } from '../components/FilterSidebar';
import { HOME_CATEGORIES, slugToCategoryName } from '../data/categories';
import type { SortOption, ViewMode } from '../types';

const defaultFilters: FilterState = {
  category: '',
  brand: '',
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  inStockOnly: false,
  promoOnly: false,
  sort: 'relevance',
};

export function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { data: products = [], isLoading } = useProductsByCategory(slug ?? '');
  const categoryName = slug ? slugToCategoryName(slug) : '';

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [view, setView] = useState<ViewMode>('grid');
  const [brandSearch, setBrandSearch] = useState('');
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = useMemo(
    () =>
      filterAndSortProducts(products, {
        brand: filters.brand || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        inStockOnly: filters.inStockOnly,
        promoOnly: filters.promoOnly,
        sort: filters.sort,
      }),
    [products, filters]
  );

  const categories = HOME_CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

  return (
    <div className="max-w-container mx-auto px-4 py-6">
      <nav className="text-sm text-muted mb-4">
        <Link to="/" className="hover:text-primary">
          Accueil
        </Link>
        {' > '}
        <span className="text-primary font-medium">{categoryName}</span>
      </nav>
      <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>

      <div className="flex gap-6">
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          <div className="card-coolblue p-4 sticky top-36">
            <FilterSidebar
              filters={{ ...filters, category: slug ?? '' }}
              onChange={(p) => setFilters((f) => ({ ...f, ...p }))}
              onClear={() => setFilters(defaultFilters)}
              categories={categories}
              brandSearch={brandSearch}
              onBrandSearch={setBrandSearch}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="card-coolblue p-4 mb-4 flex justify-between items-center">
            <p>{filtered.length} produits trouvés</p>
            <div className="flex gap-2">
              <button
                type="button"
                className="lg:hidden btn-outline text-sm"
                onClick={() => setMobileFilters(true)}
              >
                Filtrer
              </button>
              <div className="flex border border-border rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className={`p-2 ${view === 'grid' ? 'bg-primary text-white' : ''}`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`p-2 ${view === 'list' ? 'bg-primary text-white' : ''}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
          <ProductGrid products={filtered} loading={isLoading} view={view} />
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 max-h-[85vh] overflow-y-auto">
            <FilterSidebar
              filters={filters}
              onChange={(p) => setFilters((f) => ({ ...f, ...p }))}
              onClear={() => setFilters(defaultFilters)}
              categories={categories}
              brandSearch={brandSearch}
              onBrandSearch={setBrandSearch}
            />
            <button
              type="button"
              className="btn-primary w-full mt-4"
              onClick={() => setMobileFilters(false)}
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
