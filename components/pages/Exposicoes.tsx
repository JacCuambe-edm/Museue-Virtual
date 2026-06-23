import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/apiClient';
import { usePageMeta } from '../../hooks/usePageMeta';

const Exposicoes: React.FC = () => {
  usePageMeta({ title: 'Exposições', description: 'Explore as exposições do Museu Virtual da EDM — 45 Anos, 47 Anos, 48 Anos, FACIM 2025 e mais.' });
  const [exposicoes, setExposicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getExposicoes();
        setExposicoes(data);
      } catch {
        setExposicoes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const placeholderImages = [
    "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518331483807-f64201c74a00?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=600&auto=format&fit=crop",
  ];

  const getImage = (expo: any, idx: number) => {
    if (expo.foto1 && expo.foto1.trim()) {
      return expo.foto1.startsWith('//') ? `https:${expo.foto1}` : expo.foto1;
    }
    return placeholderImages[idx % placeholderImages.length];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="relative min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] flex items-end justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=2000&auto=format&fit=crop"
          alt="Exposições"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 translate-y-1/4 md:translate-y-1/2">
          <div className="bg-brand-orange rounded-lg shadow-2xl p-6 sm:p-8 md:p-10">
            <div className="border-l-4 border-white pl-4 sm:pl-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Exposições
              </h1>
              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                A EDM realiza exposições frequentes, abordando diversas temáticas e conceitos para expor e destacar a riqueza histórica de sua cadeia de valores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exposicoes Grid */}
      <section className="pt-16 sm:pt-24 md:pt-40 pb-12 sm:pb-16 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Explore as <span className="text-brand-orange">exposições</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              As exposições destacam os marcos significativos da trajetória da Electricidade de Moçambique
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : exposicoes.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma exposição encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {exposicoes.map((expo, index) => (
                <Link
                  to={`/exposicao/${expo.id}`}
                  key={expo.id}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {expo.data_inicio && (
                      <div className="absolute top-3 left-3 z-10 bg-brand-orange/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(expo.data_inicio).toLocaleDateString('pt-MZ')}
                      </div>
                    )}
                    <img
                      src={getImage(expo, index)}
                      alt={expo.artefatos_expostos || 'Exposição'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImages[index % placeholderImages.length]; }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4">
                      <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-2">
                        {expo.artefatos_expostos || 'Exposição EDM'}
                      </h3>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    {expo.descricao && (
                      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
                        {expo.descricao}
                      </p>
                    )}
                    {expo.curador && (
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                        <MapPin size={10} className="sm:w-3 sm:h-3" />
                        <span>Curador: {expo.curador}</span>
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-orange-600 font-semibold text-xs sm:text-sm">
                      Ver detalhes <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Decorative bottom */}
      <div className="relative h-32 sm:h-48 md:h-64 bg-gradient-to-br from-brand-orange to-orange-400 overflow-hidden">
        <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
      </div>
    </div>
  );
};

export default Exposicoes;
