import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap,
  Truck,
  Wrench,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import api from '../../services/apiClient';

const ArtefatosTransporte: React.FC = () => {
  const navigate = useNavigate();
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        // Fetch all and filter client-side to avoid encoding issues with 'Transporte'
        const all = await api.getArtefatos();
        const filtered = all.filter((a: any) => a.area_negocio === 'Transporte');
        setArtifacts(filtered);
      } catch (err) {
        console.error('Erro ao buscar artefatos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtifacts();
  }, []);

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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80"
          alt="Infraestrutura de Transporte"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl bg-orange-500/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl transform -skew-x-2">
              <div className="transform skew-x-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Artefatos Transporte
                </h1>
                <p className="text-lg text-white/90 leading-relaxed">
                  Conheça os equipamentos que possibilitaram o transporte de energia através de Moçambique. 
                  Cabos, isoladores, ferramentas e veículos que marcaram a história da infraestrutura eléctrica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-orange-500 text-center">
            <Zap className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-slate-900 mb-1">{artifacts.filter(a => a.categoria === 'Cabos').length}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Cabos</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-orange-500 text-center">
            <Truck className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-slate-900 mb-1">{artifacts.filter(a => a.categoria === 'Veículos').length}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Veículos</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-orange-500 text-center">
            <Wrench className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-slate-900 mb-1">{artifacts.filter(a => a.categoria === 'Ferramentas').length}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Ferramentas</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Artefatos</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Os artefatos de transporte representam a evolução da infraestrutura de transmissão de energia em Moçambique. 
              Desde os primeiros isoladores de porcelana até os modernos equipamentos de linha viva.
            </p>
            <button className="px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95">
              Ver tudo
            </button>
          </div>

          <div className="md:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArtifacts.map((item) => (
                <Link 
                  to={`/artefato/${item.id}`}
                  key={item.id}
                  className="group relative h-[300px] rounded-2xl overflow-hidden shadow-xl block"
                >
                  <img 
                    src={item.foto} 
                    alt={item.titulo}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                      ID-00{item.id}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.titulo}</h3>
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {item.localizacao}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-8">
              <button className="p-3 bg-white rounded-full shadow-md hover:bg-orange-50 text-slate-600 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="p-3 bg-white rounded-full shadow-md hover:bg-orange-50 text-slate-600 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Explore nossos artefatos e conheça todo o equipamento da EDM
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gridArtifacts.map((item) => (
              <Link 
                to={`/artefato/${item.id}`}
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.foto} 
                    alt={item.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300/f97316/ffffff?text=EDM+Transporte';
                    }}
                  />
                  <div className="absolute top-4 left-4 flex justify-between items-start w-[calc(100%-32px)]">
                    <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                      ID-00{item.id}
                    </span>
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {item.categoria}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors uppercase">
                    {item.titulo}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {item.descricao}
                  </p>
                  <div className="flex items-center text-orange-500 font-bold text-xs">
                    EXPLORAR
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtefatosTransporte;
