import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../services/apiClient';

const fallbackImages = ['/Hero01.png', '/Hero02.jpg'];

const Exhibitions: React.FC = () => {
  const [exposicoes, setExposicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getExposicoes();
        setExposicoes(data.slice(0, 3));
      } catch {
        setExposicoes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getImage = (expo: any, idx: number) => {
    const raw = expo.foto1 || expo.foto2;
    if (raw && raw.trim()) return raw.startsWith('//') ? `https:${raw}` : raw;
    return fallbackImages[idx % fallbackImages.length];
  };

  return (
    <section id="exposicoes" className="py-24 px-8 bg-on-surface font-body">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary-container" />
              <span className="text-primary-container text-xs font-bold tracking-[0.25em] uppercase">Em exibição</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-white">
              ESPAÇO DE <br />
              <span className="text-primary-container">EXPOSIÇÕES</span> ONLINE
            </h2>
          </div>
          <Link
            to="/exposicoes"
            className="group flex items-center gap-2 text-white/60 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
          >
            Ver todas
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-container animate-spin" />
          </div>
        ) : exposicoes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/50 mb-8">Nenhuma exposição disponível de momento.</p>
            <Link to="/exposicoes" className="inline-block bg-primary-container text-on-primary px-12 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-lg">
              EXPLORAR AGORA
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exposicoes.map((expo, idx) => (
              <Link
                key={expo.id}
                to={`/exposicao/${expo.id}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] block"
              >
                <img
                  src={getImage(expo, idx)}
                  alt={expo.titulo || expo.artefatos_expostos || expo.nome || 'Exposição'}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-6 w-full">
                  {expo.ano && (
                    <span className="text-primary-container text-xs font-bold uppercase tracking-widest mb-2 block">
                      {expo.ano}
                    </span>
                  )}
                  <h3 className="text-white font-black font-headline text-xl leading-tight mb-3">
                    {expo.titulo || expo.artefatos_expostos || expo.nome || 'Exposição'}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-white/60 text-sm font-medium group-hover:text-white transition-colors">
                    Ver exposição <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {exposicoes.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/exposicoes" className="inline-block border border-white/20 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 hover:border-white/40 transition-all">
              Ver todas as exposições
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Exhibitions;
