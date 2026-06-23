import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/apiClient';
import { usePageMeta } from '../../hooks/usePageMeta';

interface HistoriaPageProps {
    title: string;
    subtitle: string;
    description: string;
    category: string;
}

const defaultImage = "/logo.png"; // Fallback para não mostrar imagens aleatórias staticas

const HistoriaPage: React.FC<HistoriaPageProps> = ({ title, subtitle, description, category }) => {
    usePageMeta({ title, description });
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = category
                    ? await api.getArticles({ category })
                    : await api.getArticles();
                setArticles(data);
            } catch {
                setArticles([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [category]);

    const getImage = (article: any) => {
        if (article.image3 && article.image3.trim()) {
            return article.image3.startsWith('//') ? `https:${article.image3}` : article.image3;
        }
        return defaultImage;
    };

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative min-h-[40vh] sm:min-h-[45vh] md:min-h-[50vh] flex items-end justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-brand-orange to-amber-500" />
                <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-20">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1" />
                    </svg>
                </div>

                <div className="relative z-20 w-full max-w-4xl mx-auto px-4 translate-y-1/4 md:translate-y-1/2">
                    <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 md:p-10">
                        <div className="border-l-4 border-brand-orange pl-4 sm:pl-6">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                {title}
                            </h1>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base text-left md:text-justify">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="pt-16 sm:pt-24 md:pt-40 pb-12 sm:pb-16 px-4 md:px-6 bg-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-10 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            {subtitle} <span className="text-brand-orange">{category || 'EDM'}</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    ) : articles.length === 0 ? (
                        <p className="text-center text-gray-500">Nenhum artigo encontrado nesta categoria.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            {articles.map((article, index) => (
                                <Link
                                    to={`/artigo/${article.id}`}
                                    key={article.id}
                                    className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.3)] block"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-orange-400 to-amber-500 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm scale-[1.02]" />

                                    <div className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 group-hover:border-transparent transition-colors duration-500">
                                        <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden">
                                            <img
                                                src={getImage(article)}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultImage; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                                                <div className="bg-white/90 backdrop-blur-sm text-brand-orange text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
                                                    {article.views} views
                                                </div>
                                            </div>

                                            {article.category && (
                                                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                                                    <div className="flex items-center gap-1.5 sm:gap-2 bg-brand-orange/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                                                        <MapPin size={10} className="sm:w-3 sm:h-3" />
                                                        <span>{article.category}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 sm:p-5 md:p-6 relative">
                                            <div className="absolute top-0 right-4 sm:right-6 w-10 sm:w-12 h-1 bg-gradient-to-r from-brand-orange to-amber-400 rounded-full transform -translate-y-1/2" />
                                            <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors duration-300 leading-tight">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-5 line-clamp-3 leading-relaxed">
                                                {article.subtitle || article.short_description || (article.body_text ? article.body_text.substring(0, 120) + '...' : '')}
                                            </p>
                                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-500 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-105 transition-all duration-300">
                                                <span>Explorar</span>
                                                <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
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

export default HistoriaPage;
