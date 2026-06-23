import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/apiClient';
import { MapPin, ArrowRight } from 'lucide-react';

interface PatrimonioItem {
  id: number;
  nome: string;
  sigla: string;
  area_negocio: string;
  tipo: string;
  localizacao: string;
  ano_entrada_servico: string;
  potencia_instalada_inicial: string;
  potencia_instalada_actual: string;
  niveis_tensao: string;
  transformadores_potencia: string;
  barramento_inicial: string;
  barramento_final: string;
  capacidade_linha: string;
  condutor: string;
  circuito: string;
  comprimento: string;
  tipo_postes: string;
  tipo_isoladores: string;
  cabo_guarda: string;
  nota: string;
  descricao: string;
  foto: string;
  galeria: string;
}

const TransmissaoNorte: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'Substacao' | 'Linha'>('Substacao');
  const [items, setItems] = React.useState<PatrimonioItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await api.getPatrimonios({ 
          area_negocio: 'Transporte',
          regiao: 'Norte'
        });
        setItems(all);
      } catch (err) {
        console.error('Erro ao buscar patrimónios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = items.filter(item => item.tipo === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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
                Transmissão Norte
              </h1>
              <p className="text-gray-600 leading-relaxed text-left md:text-justify">
                Descubra as subestações e linhas de transmissão que compõem a rede de transporte de energia da região Norte de Moçambique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="pt-24 md:pt-40 pb-8 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-center gap-4 mb-8">
            <span 
              onClick={() => setActiveTab('Substacao')}
              className={`px-6 py-2 rounded-full font-medium cursor-pointer transition-colors ${
                activeTab === 'Substacao' 
                  ? 'bg-brand-orange text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              SUBSTAÇÃO
            </span>
            <span 
              onClick={() => setActiveTab('Linha')}
              className={`px-6 py-2 rounded-full font-medium cursor-pointer transition-colors ${
                activeTab === 'Linha' 
                  ? 'bg-brand-orange text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              LINHA
            </span>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-8 px-4 md:px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">Nenhum item encontrado para esta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.3)] cursor-pointer"
                  onClick={() => navigate(`/patrimonio/${item.id}`)}
                >
                  {/* Decorative Border Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-orange-400 to-amber-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm scale-[1.02]"></div>
                  
                  {/* Card Inner */}
                  <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 group-hover:border-transparent transition-colors duration-500">
                    {/* Image Container */}
                    <div className="relative h-52 overflow-hidden">
                      <img 
                        src={item.foto} 
                        alt={item.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.png'; }}
                      />
                      
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Location Badge - Bottom Left */}
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center gap-2 bg-brand-orange/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                          <MapPin size={12} />
                          <span>{item.localizacao}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-6 relative">
                      {/* Decorative Element */}
                      <div className="absolute top-0 right-6 w-12 h-1 bg-gradient-to-r from-brand-orange to-amber-400 rounded-full transform -translate-y-1/2"></div>
                      
                      {/* Sigla Badge */}
                      {item.sigla && (
                        <span className="inline-block bg-orange-100 text-brand-orange text-xs font-bold px-2 py-1 rounded mb-2">
                          {item.sigla}
                        </span>
                      )}
                      
                      <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors duration-300 leading-tight">
                        {item.nome}
                      </h3>
                      
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {item.tipo}
                      </p>
                      
                      {/* Category Tag */}
                      <span className="text-xs font-medium text-brand-orange mb-4 block">Transmissão Norte</span>
                      
                      {/* Read More Button */}
                      <span 
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-500 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-105 transition-all duration-300"
                      >
                        <span>Ler mais</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TransmissaoNorte;
