import { Link, useLocation } from 'react-router-dom';
import { NAV_CATEGORIES, categoryToSlug } from '../data/categories';
import { cn } from '../utils/cn';

export function CategoryMenu() {
  const location = useLocation();

  return (
    <nav className="bg-primary text-white hidden md:block sticky top-16 z-40">
      <div className="max-w-container mx-auto px-4">
        <ul className="flex items-center h-11 gap-0.5 overflow-x-auto text-sm font-semibold">
          {NAV_CATEGORIES.map((cat) => {
            const slug = categoryToSlug(cat);
            const href = `/categorie/${slug}`;
            const active = location.pathname === href;
            return (
              <li key={cat}>
                <Link
                  to={href}
                  className={cn(
                    'block px-3 py-2.5 whitespace-nowrap transition-colors duration-150',
                    'hover:bg-white/15 hover:underline',
                    active && 'border-b-2 border-white bg-white/10'
                  )}
                >
                  {cat}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
