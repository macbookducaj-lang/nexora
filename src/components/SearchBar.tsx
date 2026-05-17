import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { cn } from '../utils/cn';

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
}

export function SearchBar({ className, defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/catalogue?q=${encodeURIComponent(q)}`);
    else navigate('/catalogue');
  };

  return (
    <form onSubmit={submit} className={cn('flex w-full', className)}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher produit, marque, catégorie..."
        className="flex-1 border-2 border-primary rounded-l px-4 py-2 text-sm bg-white focus:outline-none"
      />
      <button
        type="submit"
        className="bg-primary text-white px-5 rounded-r hover:bg-primary-hover transition-colors duration-150"
        aria-label="Rechercher"
      >
        <Search size={20} />
      </button>
    </form>
  );
}
