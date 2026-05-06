import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  const handleCollapse = () => {
    setExpanded(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCollapse();
  };

  return (
    <div className="flex items-center justify-end">
      <div
        className={`flex items-center glass rounded-full transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? 'w-72 px-4 py-2.5' : 'w-10 h-10 cursor-pointer hover:bg-white/15'
        }`}
        onClick={!expanded ? () => setExpanded(true) : undefined}
      >
        {expanded ? (
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
            <Search size={16} className="text-white/60 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search the web…"
              className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="text-white/40 hover:text-white/70">
                <X size={14} />
              </button>
            )}
          </form>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Search size={18} className="text-white/80" />
          </div>
        )}
      </div>
    </div>
  );
}
