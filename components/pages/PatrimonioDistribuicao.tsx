import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, FileX, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/apiClient';

const defaultImage = "/vitrine/Logo Edm Horizontal-01.png";

const PatrimonioDistribuicao: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getArticles({ category: 'Distribuição' });
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getImage = (article: any) => {
    if (article.image3 && article.image3.trim()) {
      return article.image3.startsWith('//') ? `https:${article.image3}` : article.image3;
    }
    return defaultImage;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section with Interesting Visual Design */}
      <section className="relative min-h-[50vh] flex items-end justify-center">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-brand-orange to-amber-500"></div>
        

        
        {/* Wave Pattern at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
          </svg>
        </div>
        
        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        
        {/* Content Box - Overlapping into section below */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 translate-y-1/4 md:translate-y-1/2">
          <div className="bg-white rounded-lg shadow-2xl p-8 md:p-10">
            <div className="border-l-4 border-brand-orange pl-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Patrimônio Distribuição
              </h1>
              <p className="text-gray-600 leading-relaxed text-left md:text-justify">
                Conheça a infraestrutura de distribuição de energia que leva eletricidade às casas e empresas de Moçambique. Redes e equipamentos que garantem o acesso à energia em todo o país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Articles Section */}
      <section className="pt-24 md:pt-40 pb-32 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="flex justify-center py-12">
               <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-24 h-24 bg-brand-orange/10 rounded-full flex items-center justify-center mb-6">
                <FileX size={48} className="text-brand-orange" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Nenhum artigo foi publicado
              </h2>
              <p className="text-gray-500 max-w-md">
                Ainda não existem artigos publicados nesta secção. Volte em breve para conferir as novidades.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((item) => (
                <Link 
                  to={`/artigo/${item.id}`}
                  key={item.id} 
                  className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.3)] block"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-orange-400 to-amber-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm scale-[1.02]"></div>
                  
                  <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 group-hover:border-transparent transition-colors duration-500">
                    <div className="relative h-52 overflow-hidden">
                      <img 
                        src={getImage(item)} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x250/f97316/ffffff?text=EDM+Distribuição';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {item.location && (
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center gap-2 bg-brand-orange/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                            <MapPin size={12} />
                            <span>{item.location}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 relative">
                      <div className="absolute top-0 right-6 w-12 h-1 bg-gradient-to-r from-brand-orange to-amber-400 rounded-full transform -translate-y-1/2"></div>
                      
                      <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors duration-300 leading-tight">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {item.short_description || item.body_text?.substring(0, 120) + '...'}
                      </p>
                      
                      <span className="text-xs font-medium text-brand-orange mb-4 block">{item.category}</span>
                      
                      <span 
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-500 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-105 transition-all duration-300"
                      >
                        <span>Ler mais</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PatrimonioDistribuicao;
