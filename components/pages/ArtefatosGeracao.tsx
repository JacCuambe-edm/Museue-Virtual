import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Cpu,
  Box,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import api from '../../services/apiClient';

const PLACEHOLDER = '/logo.png';

const ArtefatosGeracao: React.FC = () => {
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await api.getArtefatos();
        setArtifacts(all.filter((a: any) => a.area_negocio === 'Geração'));
      } catch (err) {
        console.error('Erro ao buscar artefatos:', err);
      } finally {
        setLoading(false);
      }
    })();
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
          src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80"
          alt="Central Hidroelétrica"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl bg-orange-500/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl transform -skew-x-2">
              <div className="transform skew-x-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Artefatos Geração
                </h1>
                <p className="text-lg text-white/90 leading-relaxed">
                  Explore os equipamentos históricos que marcaram o desenvolvimento da geração de energia em Moçambique.
                  Turbinas, geradores e painéis de controle que contam a história da EDM através das décadas.
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
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {artifacts.filter(a => a.nome?.toLowerCase().includes('turbina')).length}
            </div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Turbinas</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-orange-500 text-center">
            <Cpu className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {artifacts.filter(a => a.nome?.toLowerCase().includes('gerador')).length}
            </div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Geradores</div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-orange-500 text-center">
            <Box className="w-10 h-10 text-orange-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-slate-900 mb-1">{artifacts.length}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Equipamentos</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Artefatos</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Os artefatos museológicos guardam a memória técnica e industrial da EDM de forma tangível e histórica.
              A catalogação inclui desde os mais antigos equipamentos até peças que testemunharam a evolução tecnológica
              do sector energético de Moçambique.
            </p>
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
                    src={item.foto || PLACEHOLDER}
                    alt={item.nome || ''}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                      ID-{String(item.id).padStart(3, '0')}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.nome}</h3>
                    {item.localizacao && (
                      <div className="flex items-center gap-4 text-white/70 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {item.localizacao}
                        </span>
                      </div>
                    )}
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
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.foto || PLACEHOLDER}
                    alt={item.nome || ''}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
                  />
                  <div className="absolute top-4 left-4 flex justify-between items-start w-[calc(100%-32px)]">
                    <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                      ID-{String(item.id).padStart(3, '0')}
                    </span>
                    {item.categoria && (
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {item.categoria}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors uppercase">
                    {item.nome}
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

export default ArtefatosGeracao;
