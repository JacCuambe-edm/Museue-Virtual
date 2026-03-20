import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/apiClient';

const defaultImage = "/logo.png";

const Heritage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const params = {};
        const response = await api.getPatrimonios(params);
        setItems(response ? response.slice(0, 4) : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getImage = (item: any) => {
    if (item.foto && item.foto.trim()) {
      return item.foto.startsWith('//') ? `https:${item.foto}` : item.foto;
    }
    return defaultImage;
  };

  return (
    <section className="py-24 px-8 bg-surface-container-lowest font-body">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-black font-headline tracking-tighter mb-4 text-on-surface uppercase">PATRIMÓNIO EM DESTAQUE</h2>
          <div className="w-20 h-1 bg-primary-container"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-container animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex justify-start py-8">
             <p className="text-on-surface/60 font-body">Ainda não existem registos de património em destaque.</p>
          </div>
        ) : (
          <div className="flex gap-8 overflow-x-auto pb-12 hide-scrollbar">
            {items.map((item) => (
              <Link 
                to={`/artigo/${item.id}`} 
                key={item.id} 
                className="min-w-[300px] md:min-w-[400px] bg-white rounded-2xl overflow-hidden group shadow-sm border border-outline-variant/10 block hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square overflow-hidden bg-surface-container relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={item.nome || 'Património'}  
                    src={getImage(item)}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-container text-on-primary rounded-full text-xs font-bold shadow-lg uppercase tracking-wider">
                      {item.area_negocio || 'Património'}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-bold mb-2 text-on-surface line-clamp-1">{item.nome}</h4>
                  <p className="text-on-surface/60 text-sm line-clamp-2">{item.descricao}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Heritage;