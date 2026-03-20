import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Tag, Edit, Trash2, Loader2 } from 'lucide-react';
import { api } from '../../services/apiClient';
import PageMetrics from '../ui/PageMetrics';
import CommentSection from '../ui/CommentSection';

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<any>(null);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const isAdmin = api.isAuthenticated();

    useEffect(() => {
        if (!id) return;
        loadArticle();
    }, [id]);

    const loadArticle = async () => {
        try {
            setLoading(true);
            const data = await api.getArticle(parseInt(id!));
            setArticle(data);
            
            if (data.category && data.category.startsWith('Patrimônio')) {
                try {
                    const related = await api.getArticles({ category: data.category });
                    setRelatedArticles(related.filter((a: any) => a.id !== data.id).slice(0, 3));
                } catch (e) { console.error(e); }
            }
        } catch (err: any) {
            setError(err.message || 'Artigo não encontrado');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja apagar este artigo?')) return;
        try {
            setDeleting(true);
            await api.deleteArticle(parseInt(id!));
            navigate(-1);
        } catch (err: any) {
            alert('Erro ao apagar: ' + err.message);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 text-lg">{error || 'Artigo não encontrado'}</p>
                <button onClick={() => navigate(-1)} className="text-orange-600 font-semibold flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
            </div>
        );
    }

    const imageUrl = article.image3
        ? (article.image3.startsWith('//') ? `https:${article.image3}` : article.image3)
        : null;

    const renderContent = (text: string) => {
        if (!text) return { __html: '' };
        let processed = text
            .replace(/\[color=rgb\([^)]+\)\]/g, '')
            .replace(/\[\/color\]/g, '')
            .replace(/\[justify\]/g, '<div class="text-justify">')
            .replace(/\[\/justify\]/g, '</div>')
            .replace(/### (.*)/g, '<h3 class="text-2xl sm:text-3xl font-bold mt-10 mb-6 text-orange-600">$1</h3>')
            .replace(/## (.*)/g, '<h2 class="text-3xl sm:text-4xl font-bold mt-12 mb-6 text-orange-600">$1</h2>')
            .replace(/# (.*)/g, '<h1 class="text-4xl sm:text-5xl font-bold mt-14 mb-8 text-orange-600">$1</h1>')
            // Match line item images to create a side-by-side gallery layout
            .replace(/^[\-\*]\s*!\[([^\]]*)\]\((.*?)\)\r?\n?/gm, '<img src="$2" alt="$1" class="w-full sm:w-[48%] inline-block m-1 sm:m-2 rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-300 object-cover border border-gray-100" style="max-height: 400px;" />')
            // Match standalone images
            .replace(/!\[([^\]]*)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl shadow-lg my-8 object-cover border border-gray-200" />')
            // Convert bold text and remove asterisks
            .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
            .replace(/\*\*/g, '') // Catch any stray double asterisks
            // Convert list items to bullet points to avoid asterisk bullet
            .replace(/^[\-\*]\s+(.*)/gm, '&bull; $1')
            .replace(/\n/g, '<br />');
        return { __html: processed };
    };

    const isPatrimonio = article?.category?.startsWith('Patrimônio');

    const renderPatrimonioLayout = () => {
        let markdown = article.body_text || '';
        const lines = markdown.split('\n');
        
        const propsMap = new Map<string, string>();
        const schemaFields = [
            "Localização", "Ano de entrada em serviço",
            "Potência instalada aquando entrada em serviço", "Potência instalada actual",
            "Níveis de tensão", "Transformadores de potência",
            "Barramento inicial", "Barramento final",
            "Capacidade da linha", "Condutor",
            "Circuito", "Comprimento",
            "Tipo de postes", "Tipo de condutor",
            "Tipo de isoladores", "Cabo de guarda"
        ];
        schemaFields.forEach(f => propsMap.set(f, ''));
        
        const remainingLines: string[] = [];
        let inInfoZone = true;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const match = line.match(/^\*\*(.*?)\*\*:\s*(.*)$/) || line.match(/^\*\*(.*?):\*\*\s*(.*)$/);
            
            if (match) {
                const key = match[1].trim();
                const val = match[2].trim();
                const kLower = key.toLowerCase();
                
                if (kLower === 'historial' || kLower === 'descrição' || kLower === 'nota') {
                    if (val) remainingLines.push(val);
                    inInfoZone = false;
                } else {
                    let matchedKey = key;
                    const normalizedKey = kLower.replace(/[^a-z0-9]/gi, '').replace('atual', 'actual');
                    
                    schemaFields.forEach(f => {
                        const normalizedF = f.toLowerCase().replace(/[^a-z0-9]/gi, '').replace('atual', 'actual');
                        if (normalizedF === normalizedKey) {
                            matchedKey = f;
                        }
                    });
                    
                    propsMap.set(matchedKey, val);
                }
            } else if (line.startsWith('## Descrição')) {
                continue;
            } else {
                if (line !== '') inInfoZone = false;
                if (!inInfoZone || line !== '') {
                    remainingLines.push(line);
                }
            }
        }

        const tableFields = Array.from(propsMap.entries()).map(([k, v]) => ({ key: k, value: v }));
        const textContent = remainingLines.join('\n');

        return (
            <div className="bg-white min-h-screen font-sans">
                {/* Header matching screenshot */}
                <div className="pt-24 pb-12 mt-12">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
                            {/* Left Image */}
                            <div className="w-full md:w-5/12">
                                {imageUrl ? (
                                   <div className="relative aspect-[4/3] w-full overflow-hidden">
                                       <img src={imageUrl} alt={article.title} className="w-full h-full object-cover" />
                                       <button className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition"><ArrowLeft size={24} className="drop-shadow-md" /></button>
                                       <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition rotate-180"><ArrowLeft size={24} className="drop-shadow-md" /></button>
                                   </div>
                                ) : (
                                    <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400">Sem imagem</div>
                                )}
                            </div>
                            
                            {/* Right Title */}
                            <div className="w-full md:w-7/12 pt-4">
                                <h1 className="text-3xl md:text-4xl text-gray-800 mb-4 font-normal">
                                    {article.title}
                                </h1>
                                <p className="text-gray-600 text-lg mb-2">
                                    {article.short_description}
                                </p>
                                <p className="text-gray-600">
                                    {article.category.replace('Patrimônio ', '')}
                                </p>

                                <div className="mt-6">
                                    <PageMetrics type="article" id={article.id} />
                                </div>

                                {isAdmin && (
                                    <div className="flex gap-4 mt-8">
                                        <Link to={`/admin/dashboard/stories/edit/${article.id}`} className="text-orange-500 hover:text-orange-600 flex items-center gap-2 text-sm"><Edit size={16}/> Editar</Link>
                                        <button onClick={handleDelete} className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm"><Trash2 size={16}/> Apagar</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separator / Description block */}
                <div className="container mx-auto px-4 max-w-6xl pb-16">
                    <div className="border border-gray-100 rounded-2xl p-6 md:p-10 shadow-sm">
                        <h3 className="text-orange-500 font-bold text-xl mb-6">Descrição</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 border border-gray-100 mb-8">
                            {tableFields.map((field, idx) => (
                                <div key={idx} className="bg-white p-4">
                                    <p className="text-sm text-gray-800">
                                        {field.key}: <span className="text-gray-600">{field.value}</span>
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="prose prose-sm md:prose-base max-w-none text-gray-700 text-justify prose-headings:text-gray-900 prose-h1:text-gray-900 prose-h2:text-gray-900 prose-h3:text-gray-900">
                            <span className="text-sm font-medium text-gray-900 block mb-1">Nota:</span>
                            <div className="text-sm" dangerouslySetInnerHTML={{ __html: renderContent(textContent).__html.replace(/text-orange-600/g, 'text-gray-900') }} />
                            {article.body_text2 && <div className="mt-4 text-sm" dangerouslySetInnerHTML={{ __html: renderContent(article.body_text2).__html.replace(/text-orange-600/g, 'text-gray-900') }} />}
                            {article.body_text3 && <div className="mt-4 text-sm" dangerouslySetInnerHTML={{ __html: renderContent(article.body_text3).__html.replace(/text-orange-600/g, 'text-gray-900') }} />}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-6xl pb-8">
                    <CommentSection type="article" id={article.id} />
                </div>

                {/* Ver mais Section */}
                {relatedArticles.length > 0 && (
                    <div className="bg-gray-50 py-16">
                        <div className="container mx-auto px-4 max-w-6xl">
                            <h2 className="text-3xl font-bold text-center mb-12 text-black">Ver mais</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                {relatedArticles.map((rel: any) => (
                                    <div key={rel.id} className="cursor-pointer group bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1" onClick={() => { window.scrollTo(0,0); navigate(`/artigo/${rel.id}`); }}>
                                        <div className="h-48 overflow-hidden bg-gray-100">
                                            {rel.image3 ? (
                                                <img src={rel.image3.startsWith('//') ? `https:${rel.image3}` : rel.image3} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">Sem imagem</div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <p className="text-xs font-semibold text-orange-500 mb-2 uppercase tracking-wider">{rel.category.replace('Patrimônio ', '')}</p>
                                            <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                                                {rel.title}
                                            </h3>
                                            <div className="flex items-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                                                <span>{new Date(rel.created_at).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                <span className="mx-2">•</span>
                                                <span>by {rel.author_email?.split('@')[0] || 'admin'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <div className="h-1.5 w-16 bg-gray-400 rounded-full"></div>
                                <div className="h-1.5 w-4 bg-gray-200 rounded-full"></div>
                                <div className="h-1.5 w-4 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (isPatrimonio) return renderPatrimonioLayout();

    return (
        <article className="min-h-screen bg-white">
            {/* Hero Banner */}
            <div className="relative w-full min-h-[45vh] sm:min-h-[50vh] md:min-h-[60vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden flex flex-col">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex flex-col justify-between pt-24 pb-8 md:pb-12 flex-1">
                    {/* Back button */}
                    <div className="flex justify-start mb-12">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 bg-black/40 hover:bg-black/60 hover:scale-105 backdrop-blur-md rounded-full px-5 py-2.5 text-sm sm:text-base font-medium z-20 shadow-lg border border-white/10"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Voltar</span>
                        </button>
                    </div>

                    <div className="mt-auto">
                        {/* Category badge */}
                        {article.category && (
                            <div className="mb-4 md:mb-5">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 transition-colors text-white rounded-full text-xs sm:text-sm font-semibold shadow-md cursor-pointer border border-orange-400/50"
                                >
                                    <Tag className="w-3.5 h-3.5" />
                                    {article.category}
                                </button>
                            </div>
                        )}

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">
                            {article.title}
                        </h1>

                        {article.short_description && (
                            <p className="text-white/70 text-sm sm:text-base md:text-lg mt-2 md:mt-3 max-w-2xl">
                                {article.short_description}
                            </p>
                        )}

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 md:mt-6 text-white/60 text-xs sm:text-sm">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(article.created_at).toLocaleDateString('pt-MZ', {
                                    day: '2-digit', month: 'long', year: 'numeric'
                                })}
                            </span>
                            <div className="bg-white/95 rounded-full px-4 py-1.5 shadow-lg transform -translate-y-1">
                                <PageMetrics type="article" id={article.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Body */}
            <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Main image (full width inside article) */}
                    {imageUrl && (
                        <div className="mb-8 md:mb-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={imageUrl}
                                alt={article.title}
                                className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-cover"
                            />
                        </div>
                    )}

                    {/* Body text */}
                    <div className="prose prose-base sm:prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed space-y-6 sm:space-y-8">
                        {article.body_text && (
                            <div
                                className="whitespace-pre-wrap text-base sm:text-lg md:text-xl"
                                dangerouslySetInnerHTML={renderContent(article.body_text)}
                            />
                        )}

                        {article.body_text2 && (
                            <div className="whitespace-pre-wrap text-base sm:text-lg md:text-xl mt-8 pt-8 border-t border-gray-100"
                                dangerouslySetInnerHTML={renderContent(article.body_text2)}
                            />
                        )}

                        {article.body_text3 && (
                            <div className="whitespace-pre-wrap text-base sm:text-lg md:text-xl mt-8 pt-8 border-t border-gray-100"
                                dangerouslySetInnerHTML={renderContent(article.body_text3)}
                            />
                        )}
                    </div>

                    {/* Author info */}
                    {article.author_email && (
                        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                            <p className="text-xs sm:text-sm text-gray-400">
                                Publicado por <span className="text-gray-600 font-medium">{article.author_email}</span>
                            </p>
                        </div>
                    )}

                    {/* Admin Actions - Only visible for authenticated admin */}
                    {isAdmin && (
                        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-orange-100">
                            <div className="bg-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                <h3 className="text-sm font-semibold text-orange-800 mb-3 sm:mb-4 uppercase tracking-wider">
                                    Painel de Administração
                                </h3>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        to={`/admin/dashboard/stories/edit/${article.id}`}
                                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 text-white rounded-lg sm:rounded-xl font-medium hover:bg-orange-700 transition-colors text-sm sm:text-base"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar artigo
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg sm:rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                                    >
                                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        {deleting ? 'Apagando...' : 'Apagar artigo'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-5xl pb-16">
                <CommentSection type="article" id={article.id} />
            </div>
        </article>
    );
};

export default ArticleDetail;
