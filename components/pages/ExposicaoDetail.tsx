import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Edit, Trash2, Loader2 } from 'lucide-react';
import { api } from '../../services/apiClient';
import PageMetrics from '../ui/PageMetrics';
import CommentSection from '../ui/CommentSection';

const ExposicaoDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<any>(null);
    const [relatedExpos, setRelatedExpos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const isAdmin = api.isAuthenticated();

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setLoading(true);
                const data = await api.getExposicao(parseInt(id));
                setItem(data);

                // Load related exhibitions
                try {
                    const all = await api.getExposicoes();
                    setRelatedExpos(all.filter((e: any) => e.id !== data.id).slice(0, 3));
                } catch (e) { console.error(e); }
            } catch (err: any) {
                setError(err.message || 'Exposição não encontrada');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja apagar esta exposição?')) return;
        try {
            setDeleting(true);
            await api.deleteExposicao(parseInt(id!));
            navigate(-1);
        } catch (err: any) {
            alert('Erro ao apagar: ' + err.message);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>;
    if (error || !item) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p className="text-gray-500 text-lg">{error}</p><button onClick={() => navigate(-1)} className="text-orange-600 font-semibold flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Voltar</button></div>;

    const foto1Url = item.foto1 ? (item.foto1.startsWith('//') ? `https:${item.foto1}` : item.foto1) : null;
    const titulo = item.titulo || item.artefatos_expostos || 'Exposição';

    // Parse gallery from JSON
    let galleryImages: string[] = [];
    try {
        if (item.galeria) {
            galleryImages = JSON.parse(item.galeria);
        }
    } catch {
        galleryImages = [];
    }
    // If no gallery column, fall back to foto1+foto2
    if (galleryImages.length === 0) {
        if (foto1Url) galleryImages.push(foto1Url);
        const foto2Url = item.foto2 ? (item.foto2.startsWith('//') ? `https:${item.foto2}` : item.foto2) : null;
        if (foto2Url) galleryImages.push(foto2Url);
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Hero Banner */}
            <div className="relative w-full h-[35vh] sm:h-[45vh] md:h-[55vh] overflow-hidden">
                {foto1Url ? (
                    <img src={foto1Url} alt={titulo} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-400" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 md:top-8 md:left-8 z-20 flex items-center gap-2 text-white/80 hover:text-white bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-sm transition-all">
                    <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Voltar</span>
                </button>

                <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-4 md:px-6 pb-8 md:pb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">
                        {titulo}
                    </h1>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 md:px-6 py-8 md:py-16 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    {/* Main Text */}
                    <div className="w-full lg:w-2/3">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{titulo}</h2>
                        {item.curador && (
                            <span className="inline-block px-4 py-1.5 bg-orange-500 text-white rounded-full text-xs font-semibold mb-6">
                                {item.curador}
                            </span>
                        )}

                        <div className="mb-6">
                            <PageMetrics type="exhibition" id={item.id} />
                        </div>
                        {item.descricao && (
                            <div className="prose prose-base max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base md:text-[15px] text-justify mt-4">
                                {item.descricao}
                            </div>
                        )}

                        {isAdmin && (
                            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                                <Link to={`/admin/dashboard/exhibitions/edit/${item.id}`} className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium"><Edit size={16}/> Editar</Link>
                                <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium"><Trash2 size={16}/> {deleting ? 'Apagando...' : 'Apagar'}</button>
                            </div>
                        )}
                    </div>

                    {/* Info Sidebar */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
                            <h3 className="text-lg font-bold text-gray-900">Informações</h3>
                            
                            {item.responsavel && (
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Responsável</p>
                                        <p className="text-sm text-gray-700 font-medium">{item.responsavel}</p>
                                    </div>
                                </div>
                            )}
                            {!item.responsavel && item.curador && (
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Responsável</p>
                                        <p className="text-sm text-gray-700 font-medium">{item.curador}</p>
                                    </div>
                                </div>
                            )}

                            {item.localizacao && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Localização</p>
                                        <p className="text-sm text-gray-700 font-medium">{item.localizacao}</p>
                                    </div>
                                </div>
                            )}

                            {item.data_inicio && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Data</p>
                                        <p className="text-sm text-gray-700 font-medium">
                                            {new Date(item.data_inicio).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            {item.data_fim ? ` — ${new Date(item.data_fim).toLocaleDateString('pt-MZ')}` : ''}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            {galleryImages.length > 0 && (
                <div className="container mx-auto px-4 md:px-6 pb-16 max-w-6xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10">Galeria</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {galleryImages.map((img: string, idx: number) => (
                            <div key={idx} className={`overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 group ${idx === 0 ? 'col-span-2 md:col-span-2 row-span-2' : ''}`}>
                                <img
                                    src={img.startsWith('//') ? `https:${img}` : img}
                                    alt={`Galeria ${idx + 1}`}
                                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${idx === 0 ? 'h-64 sm:h-80 md:h-[400px]' : 'h-40 sm:h-48 md:h-52'}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 md:px-6 max-w-6xl pb-16">
                <CommentSection type="exhibition" id={item.id} />
            </div>

            {/* Ver mais Section */}
            {relatedExpos.length > 0 && (
                <div className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <h2 className="text-3xl font-bold text-center mb-12 text-black">Ver mais</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {relatedExpos.map((rel: any) => {
                                const relImg = rel.foto1 ? (rel.foto1.startsWith('//') ? `https:${rel.foto1}` : rel.foto1) : null;
                                return (
                                    <div key={rel.id} className="cursor-pointer group bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 rounded-xl overflow-hidden" onClick={() => { window.scrollTo(0,0); navigate(`/exposicao/${rel.id}`); }}>
                                        <div className="h-48 overflow-hidden bg-gray-100">
                                            {relImg ? (
                                                <img src={relImg} alt={rel.titulo || rel.artefatos_expostos} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">Sem imagem</div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <p className="text-xs font-semibold text-orange-500 mb-2 uppercase tracking-wider">{rel.curador || 'Exposição'}</p>
                                            <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                                                {rel.titulo || rel.artefatos_expostos || 'Exposição'}
                                            </h3>
                                            <div className="flex items-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                                                {rel.data_inicio && <span>{new Date(rel.data_inicio).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' })}</span>}
                                                {rel.curador && <><span className="mx-2">•</span><span>{rel.curador}</span></>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExposicaoDetail;
