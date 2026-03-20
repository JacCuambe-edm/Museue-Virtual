import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Edit, Trash2, Loader2 } from 'lucide-react';
import { api } from '../../services/apiClient';
import PageMetrics from '../ui/PageMetrics';
import CommentSection from '../ui/CommentSection';

const EventoDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const isAdmin = api.isAuthenticated();

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setLoading(true);
                const data = await api.getEvento(parseInt(id));
                setItem(data);
            } catch (err: any) {
                setError(err.message || 'Evento não encontrado');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja apagar este evento?')) return;
        try {
            setDeleting(true);
            await api.deleteEvento(parseInt(id!));
            navigate(-1);
        } catch (err: any) {
            alert('Erro ao apagar: ' + err.message);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>;
    if (error || !item) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p className="text-gray-500 text-lg">{error}</p><button onClick={() => navigate(-1)} className="text-orange-600 font-semibold flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Voltar</button></div>;

    const fotoUrl = item.foto ? (item.foto.startsWith('//') ? `https:${item.foto}` : item.foto) : null;

    return (
        <article className="min-h-screen bg-white">
            <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                {fotoUrl && <img src={fotoUrl} alt={item.nome} className="absolute inset-0 w-full h-full object-cover opacity-40" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex flex-col justify-end pb-8 md:pb-12">
                    <button onClick={() => navigate(-1)} className="absolute top-4 left-4 md:top-8 md:left-6 flex items-center gap-2 text-white/80 hover:text-white bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                        <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Voltar</span>
                    </button>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white rounded-full text-xs sm:text-sm font-semibold w-fit mb-3">Evento</span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">{item.nome}</h1>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 text-white/60 text-xs sm:text-sm">
                        {item.local_evento && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{item.local_evento}</span>}
                        {item.data_inicio && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(item.data_inicio).toLocaleDateString('pt-MZ')}{item.data_fim ? ` — ${new Date(item.data_fim).toLocaleDateString('pt-MZ')}` : ''}</span>}
                        
                        <div className="bg-white/95 rounded-full px-4 py-1.5 shadow-lg transform -translate-y-1">
                            <PageMetrics type="event" id={item.id} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
                <div className="max-w-3xl mx-auto">
                    {fotoUrl && (
                        <div className="mb-8 md:mb-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                            <img src={fotoUrl} alt={item.nome} className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-cover" />
                        </div>
                    )}

                    {item.subtitulo && <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap">{item.subtitulo}</p>}
                    {item.participantes && (
                        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Participantes</h3>
                            <p className="text-gray-600 text-sm sm:text-base whitespace-pre-wrap">{item.participantes}</p>
                        </div>
                    )}

                    {isAdmin && (
                        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-orange-100">
                            <div className="bg-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                <h3 className="text-sm font-semibold text-orange-800 mb-3 sm:mb-4 uppercase tracking-wider">Painel de Administração</h3>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link to={`/admin/dashboard/events/edit/${item.id}`} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 text-white rounded-lg sm:rounded-xl font-medium hover:bg-orange-700 transition-colors text-sm sm:text-base"><Edit className="w-4 h-4" />Editar evento</Link>
                                    <button onClick={handleDelete} disabled={deleting} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg sm:rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 text-sm sm:text-base">{deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}{deleting ? 'Apagando...' : 'Apagar evento'}</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-3xl pb-16">
                <CommentSection type="event" id={item.id} />
            </div>
        </article>
    );
};

export default EventoDetail;
