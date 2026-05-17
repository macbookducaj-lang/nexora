import { BRANDS } from '../data/categories';
import type { SortOption } from '../types';

export interface FilterState {
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  promoOnly: boolean;
  sort: SortOption;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onClear: () => void;
  categories: { slug: string; name: string }[];
  brandSearch: string;
  onBrandSearch: (v: string) => void;
}

export function FilterSidebar({
  filters,
  onChange,
  onClear,
  categories,
  brandSearch,
  onBrandSearch,
}: FilterSidebarProps) {
  const filteredBrands = BRANDS.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <aside className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Filtrer les résultats</h2>
      </div>
      <button type="button" onClick={onClear} className="btn-outline w-full text-sm py-2">
        Effacer tout
      </button>

      <details open className="border-b border-border pb-4">
        <summary className="font-semibold cursor-pointer py-2">Catégorie</summary>
        <div className="space-y-2 mt-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="cat"
              checked={!filters.category}
              onChange={() => onChange({ category: '' })}
              className="accent-primary"
            />
            Toutes
          </label>
          {categories.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cat"
                checked={filters.category === c.slug}
                onChange={() => onChange({ category: c.slug })}
                className="accent-primary"
              />
              {c.name}
            </label>
          ))}
        </div>
      </details>

      <details open className="border-b border-border pb-4">
        <summary className="font-semibold cursor-pointer py-2">Prix</summary>
        <div className="mt-3 space-y-2">
          <input
            type="range"
            min={0}
            max={2000}
            step={10}
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: Number(e.target.value) })}
            className="w-full accent-primary"
          />
          <input
            type="range"
            min={0}
            max={2000}
            step={10}
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            className="w-full accent-primary"
          />
          <p className="text-xs text-muted">
            {filters.minPrice}€ — {filters.maxPrice}€
          </p>
        </div>
      </details>

      <details open className="border-b border-border pb-4">
        <summary className="font-semibold cursor-pointer py-2">Marque</summary>
        <input
          type="search"
          placeholder="Rechercher une marque..."
          value={brandSearch}
          onChange={(e) => onBrandSearch(e.target.value)}
          className="w-full border border-border rounded px-2 py-1.5 text-sm mt-2 mb-2"
        />
        <div className="space-y-2 text-sm max-h-36 overflow-y-auto">
          {filteredBrands.map((b) => (
            <label key={b} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-primary"
                checked={filters.brand === b}
                onChange={() =>
                  onChange({ brand: filters.brand === b ? '' : b })
                }
              />
              {b}
            </label>
          ))}
        </div>
      </details>

      <details open className="border-b border-border pb-4">
        <summary className="font-semibold cursor-pointer py-2">Note minimum</summary>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ minRating: n })}
              className={`text-xl ${n <= filters.minRating ? 'text-accent' : 'text-skeleton'}`}
            >
              ★
            </button>
          ))}
        </div>
      </details>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => onChange({ inStockOnly: e.target.checked })}
          className="accent-primary"
        />
        En stock uniquement
      </label>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={filters.promoOnly}
          onChange={(e) => onChange({ promoOnly: e.target.checked })}
          className="accent-primary"
        />
        Promotions uniquement
      </label>
    </aside>
  );
}
