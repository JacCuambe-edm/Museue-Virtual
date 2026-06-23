import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, FileText, Image, Package, Landmark, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/apiClient';

interface SearchResult {
  id: number;
  name: string;
  description: string;
  category: string;
  type: string;
  image: string | null;
  url: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  article: <FileText className="w-4 h-4" />,
  exposicao: <Image className="w-4 h-4" />,
  artefato: <Package className="w-4 h-4" />,
  patrimonio: <Landmark className="w-4 h-4" />,
  evento: <Calendar className="w-4 h-4" />,
};

const TYPE_LABELS: Record<string, string> = {
  article: 'Artigo',
  exposicao: 'Exposição',
  artefato: 'Artefacto',
  patrimonio: 'Património',
  evento: 'Evento',
};

interface Props {
  onClose: () => void;
}

const SearchModal: React.FC<Props> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.search(query.trim());
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Pesquisar artigos, artefactos, exposições..."
            className="flex-1 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent"
          />
          {loading && <Loader2 className="w-4 h-4 text-orange-500 animate-spin flex-shrink-0" />}
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length >= 2 && !loading && results.length === 0 && (
            <p className="text-center text-gray-400 py-12 text-sm">
              Nenhum resultado encontrado para "<strong>{query}</strong>"
            </p>
          )}

          {results.length > 0 && (
            <ul>
              {results.map((r, i) => (
                <li key={`${r.type}-${r.id}`}>
                  <Link
                    to={r.url}
                    onClick={onClose}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    {r.image ? (
                      <img
                        src={r.image}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-500">
                        {TYPE_ICONS[r.type] || <Search className="w-4 h-4" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                          {TYPE_LABELS[r.type] || r.type}
                        </span>
                        {r.category && (
                          <span className="text-xs text-gray-400">{r.category}</span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate">{r.name}</p>
                      {r.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.description}</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query.trim().length < 2 && (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              <Search className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <p>Escreva pelo menos 2 caracteres para pesquisar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
