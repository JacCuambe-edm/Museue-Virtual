import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, PlugZap, Gauge, Network, MapPin, ArrowRight } from 'lucide-react';
import api from '../../services/apiClient';

const PLACEHOLDER = '/logo.png';

const ArtefatosDistribuicao: React.FC = () => {
  const navigate = useNavigate();
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await api.getArtefatos();
        // Include Distribuição and Distribuicao (both spellings)
        setArtifacts(all.filter((a: any) =>
          a.area_negocio === 'Distribuição' || a.area_negocio === 'Distribuicao'
        ));
      } catch (err) {
        console.error('Erro ao buscar artefatos:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = [
    { icon: <PlugZap size={24} />, count: artifacts.filter(a => a.categoria === 'Contadores').length, label: 'Contadores' },
    { icon: <Gauge size={24} />, count: artifacts.filter(a => a.categoria === 'Medidores').length, label: 'Medidores' },
    { icon: <Network size={24} />, count: artifacts.filter(a => a.categoria === 'Redes').length, label: 'Redes' },
  ];

  const featuredArtifacts = artifacts.slice(0, 3);
  const gridArtifacts = artifacts.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section
        className="relative min-h-[60vh] flex items-end justify-center"
        style={{
          backgroundImage: `url('/images/Artefatos/Distribuição.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-24"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 translate-y-1/4 md:translate-y-1/2">
          <div className="bg-brand-orange rounded-lg shadow-2xl p-8 md:p-10">
            <div className="border-l-4 border-white pl-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Artefatos Distribuição
              </h1>
              <p className="text-white/90 leading-relaxed text-left md:text-justify">
                Descubra os equipamentos que levaram energia às casas e empresas de Moçambique. Contadores,
                transformadores de distribuição e dispositivos de proteção que garantiram o fornecimento seguro de eletricidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Stats */}
      <section className="pt-56 pb-8 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="text-brand-orange mb-2">{cat.icon}</div>
                <span className="text-2xl font-bold text-gray-900">{cat.count}</span>
                <span className="text-sm text-gray-500">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Artefatos</h2>
              <p className="text-gray-600 leading-relaxed mb-8 text-left md:text-justify">
                Os artefatos de distribuição documentam a evolução dos sistemas de entrega de energia aos consumidores finais.
                Desde os primeiros contadores eletromecânicos até os modernos medidores digitais, cada equipamento representa
                um capítulo importante na história da eletrificação de Moçambique.
              </p>
              <Link
                to="/artefatos"
                className="inline-block bg-brand-orange text-white font-semibold px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
              >
                Ver tudo
              </Link>
            </div>

            <div className="relative">
              {featuredArtifacts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredArtifacts.map((artifact, index) => (
                    <div
                      key={artifact.id}
                      className={`relative rounded-xl overflow-hidden shadow-lg group cursor-pointer ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}
                      onClick={() => navigate(`/artefato/${artifact.id}`)}
                    >
                      <div className="absolute top-3 left-3 z-10 bg-brand-orange text-white text-xs font-medium px-3 py-1.5 rounded-full">
                        ID-{String(artifact.id).padStart(3, '0')}
                      </div>
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={artifact.foto || PLACEHOLDER}
                          alt={artifact.nome || ''}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                        <h3 className="text-white font-semibold text-sm line-clamp-2">{artifact.nome}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                  <p>Nenhum artefato de Distribuição registado ainda.</p>
                </div>
              )}
              <div className="flex items-center justify-end mt-4 gap-2 text-gray-600">
                <span className="text-sm font-medium">Next</span>
                <div className="w-8 h-8 rounded-full border-2 border-brand-orange flex items-center justify-center">
                  <ChevronRight size={16} className="text-brand-orange" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      {gridArtifacts.length > 0 && (
        <section className="py-16 px-4 md:px-6 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
              Explore nossos artefatos e conheça todo o equipamento da EDM
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {gridArtifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  onClick={() => navigate(`/artefato/${artifact.id}`)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute top-3 left-3 z-10 bg-brand-orange/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                      ID-{String(artifact.id).padStart(3, '0')}
                    </div>
                    {artifact.categoria && (
                      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-brand-orange text-xs font-bold px-3 py-1.5 rounded-lg">
                        {artifact.categoria}
                      </div>
                    )}
                    <img
                      src={artifact.foto || PLACEHOLDER}
                      alt={artifact.nome || ''}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
                      {artifact.nome}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2">{artifact.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ArtefatosDistribuicao;
