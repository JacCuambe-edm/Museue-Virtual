import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Receipt, Calculator, CreditCard, ChevronLeft, MapPin, ArrowRight } from 'lucide-react';
import api from '../../services/apiClient';

const ArtefatosComercial: React.FC = () => {
  const navigate = useNavigate();
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const all = await api.getArtefatos();
        const filtered = all.filter((a: any) => a.area_negocio === 'Comercial');
        setArtifacts(filtered);
      } catch (err) {
        console.error('Erro ao buscar artefatos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtifacts();
  }, []);

  const categories = [
    { icon: <Receipt size={24} />, count: artifacts.filter(a => a.categoria === 'Contadores').length, label: 'Contadores' },
    { icon: <Calculator size={24} />, count: artifacts.filter(a => a.categoria === 'Credelec').length, label: 'Sistemas Credelec' },
    { icon: <CreditCard size={24} />, count: artifacts.filter(a => a.categoria === 'Documentos').length, label: 'Documentos' }
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
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-[60vh] flex items-end justify-center"
        style={{
          backgroundImage: `url('/images/Artefatos/Comercialização.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Spacer for header */}
        <div className="absolute top-0 left-0 right-0 h-24"></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Content Box - Overlapping into white section */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 translate-y-1/4 md:translate-y-1/2">
          <div className="bg-brand-orange rounded-lg shadow-2xl p-8 md:p-10">
            <div className="border-l-4 border-white pl-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Artefatos Comercial
              </h1>
              <p className="text-white/90 leading-relaxed text-left md:text-justify">
                Explore a história comercial da EDM através de documentos, equipamentos e sistemas que marcaram a relação com os clientes. Faturas históricas, máquinas registradoras e uniformes que contam a evolução do atendimento ao público.
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
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Artefatos
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8 text-left md:text-justify">
                Os artefatos comerciais preservam a memória da interação entre a EDM e seus clientes ao longo das décadas. Desde os primeiros livros de registro até os modernos sistemas de atendimento, cada item documenta a evolução dos serviços prestados à população moçambicana.
              </p>
              <Link 
                to="/artefatos"
                className="inline-block bg-brand-orange text-white font-semibold px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
              >
                Ver tudo
              </Link>
            </div>

            {/* Right - Carousel */}
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredArtifacts.map((artifact, index) => (
                  <div 
                    key={artifact.id}
                    className={`relative rounded-xl overflow-hidden shadow-lg group cursor-pointer ${
                      index === 2 ? 'col-span-2 md:col-span-1' : ''
                    }`}
                    onClick={() => navigate(`/artefato/${artifact.id}`)}
                  >
                    {/* Code Badge */}
                    <div className="absolute top-3 left-3 z-10 bg-brand-orange text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      ID-{artifact.id.toString().padStart(3, '0')}
                    </div>
                    
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={artifact.foto}
                        alt={artifact.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300/f97316/ffffff?text=EDM+Artefato';
                        }}
                      />
                    </div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                      <h3 className="text-white font-semibold text-sm line-clamp-2">{artifact.titulo}</h3>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Next Label */}
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
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* Code Badge */}
                  <div className="absolute top-3 left-3 z-10 bg-brand-orange/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                    ID-{artifact.id.toString().padStart(3, '0')}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-brand-orange text-xs font-bold px-3 py-1.5 rounded-lg">
                    {artifact.categoria}
                  </div>
                  
                  <img 
                    src={artifact.foto}
                    alt={artifact.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300/f97316/ffffff?text=EDM+Artefato';
                    }}
                  />
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
                    {artifact.titulo}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2">
                    {artifact.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Orange Triangle */}
      <div className="relative h-64 bg-gradient-to-br from-brand-orange to-orange-400 overflow-hidden">
        <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
      </div>
    </div>
  );
};

export default ArtefatosComercial;
