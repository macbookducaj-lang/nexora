import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid3x3, List, ChevronDown } from 'lucide-react';
import { useProducts, filterAndSortProducts } from '../hooks/useProducts';
import { searchProducts } from '../lib/products';
import { ProductGrid } from '../components/ProductGrid';
import {
  FilterSidebar,
  type FilterState,
} from '../components/FilterSidebar';
import { HOME_CATEGORIES } from '../data/categories';
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

export function Catalogue() {
  const [searchParams] = useSearchParams();
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    brand: searchParams.get('brand') ?? '',
    promoOnly: searchParams.get('promo') === '1',
    sort: (searchParams.get('sort') as SortOption) || 'relevance',
  }));
  const [view, setView] = useState<ViewMode>('grid');
  const [brandSearch, setBrandSearch] = useState('');
  const [mobileFilters, setMobileFilters] = useState(false);

  const query = searchParams.get('q') ?? '';

  const filtered = useMemo(() => {
    let list = query ? searchProducts(products, query) : products;
    return filterAndSortProducts(list, {
      category: filters.category || undefined,
      brand: filters.brand || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      inStockOnly: filters.inStockOnly,
      promoOnly: filters.promoOnly,
      sort: filters.sort,
    });
  }, [products, query, filters]);

  const categories = HOME_CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

  return (
    <div className="max-w-container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Catalogue</h1>
      <div className="flex gap-6">
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          <div className="card-coolblue p-4 sticky top-36">
            <FilterSidebar
              filters={filters}
              onChange={(p) => setFilters((f) => ({ ...f, ...p }))}
              onClear={() => setFilters(defaultFilters)}
              categories={categories}
              brandSearch={brandSearch}
              onBrandSearch={setBrandSearch}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="card-coolblue p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
            <p className="font-medium">{filtered.length} produits trouvés</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden btn-outline text-sm py-2"
                onClick={() => setMobileFilters(true)}
              >
                Filtrer
              </button>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      sort: e.target.value as SortOption,
                    }))
                  }
                  className="border border-border rounded px-3 py-2 pr-8 text-sm bg-white"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="price-asc">Prix ↑</option>
                  <option value="price-desc">Prix ↓</option>
                  <option value="rating">Mieux notés</option>
                  <option value="newest">Nouveautés</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
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

          <ProductGrid products={filtered} loading={loading} view={view} />
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
