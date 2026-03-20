import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Tag, 
  Box, 
  Maximize2,
  User,
  Wrench,
  Loader2,
  X
} from 'lucide-react';
import api from '../../services/apiClient';
import PageMetrics from '../ui/PageMetrics';
import CommentSection from '../ui/CommentSection';

const ArtefatoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artifact, setArtifact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLImageElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const fetchArtifact = async () => {
      try {
        if (!id) return;
        const data = await api.getArtefato(parseInt(id));
        setArtifact(data);
        setActiveImage(data.foto);
        if (data.galeria) {
          try {
            setGallery(JSON.parse(data.galeria));
          } catch (e) {
            setGallery([data.foto]);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar artefato:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtifact();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 font-serif">Artefato não encontrado</h2>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full font-bold hover:shadow-lg transition-all"
        >
          <ArrowLeft size={20} /> Voltar para Coleção
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      {/* Lightbox Modal */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setIsExpanded(false)}
        >
          <button 
            className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-[110]"
            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
          >
            <X size={32} />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img 
              src={activeImage} 
              alt={artifact.titulo}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500 transition-all duration-300 ease-out cursor-zoom-out"
              style={{ 
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                transform: 'scale(2.5)'
              }}
              onMouseMove={handleMouseMove}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-orange-500 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          Voltar para a Coleção
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Visual Gallery */}
          <div className="space-y-6">
            <div 
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-100 cursor-pointer group/main"
              onClick={() => setIsExpanded(true)}
            >
              <img 
                src={activeImage} 
                alt={artifact.titulo}
                className="w-full h-full object-cover transition-all duration-500 ease-out group-hover/main:scale-[2]"
                style={{ 
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                }}
              />
              <div 
                className="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors duration-300" 
                onMouseMove={handleMouseMove}
              />
              <button 
                className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-slate-900 hover:bg-orange-500 hover:text-white transition-all transform scale-90 group-hover/main:scale-100"
                onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
              >
                <Maximize2 size={24} />
              </button>
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-orange-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${artifact.titulo} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="flex flex-col">
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100">
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="px-4 py-1.5 bg-orange-500 text-white text-xs font-black rounded-full uppercase tracking-widest">
                  {artifact.area_negocio}
                </span>
                <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-black rounded-full uppercase tracking-widest">
                  {artifact.categoria}
                </span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-auto">
                  ID-00{artifact.id}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight font-serif">
                {artifact.titulo}
              </h1>

              <div className="flex items-center gap-3 text-slate-500 mb-8 border-b border-slate-100 pb-8">
                <MapPin size={18} className="text-orange-500" />
                <span className="font-medium mr-auto">{artifact.localizacao}</span>
                <PageMetrics type="artifact" id={artifact.id} />
              </div>

              <div className="prose prose-lg text-slate-600 mb-10 leading-relaxed text-justify">
                {artifact.descricao}
              </div>

              {/* Technical Profile Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pt-10 border-t border-slate-100">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <Calendar size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Entrada em Serviço</h4>
                      <p className="text-slate-900 font-bold">{artifact.data_aquisicao || 'No histórico'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <Wrench size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estado de Conservação</h4>
                      <p className="text-slate-900 font-bold">{artifact.estado}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <Maximize2 size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dimensões</h4>
                      <p className="text-slate-900 font-bold">{artifact.dimensoes}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <User size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Responsável Técnica</h4>
                      <p className="text-slate-900 font-bold">{artifact.responsavel}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Specs */}
              <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-between mt-8">
                <div className="flex items-center gap-3">
                  <Box size={20} className="text-orange-500" />
                  <span className="text-sm font-bold text-slate-700">Material principal: <span className="text-slate-900">{artifact.material}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Musealizado</span>
                </div>
              </div>
              
              <div className="mt-12">
                <CommentSection type="artifact" id={artifact.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtefatoDetail;
