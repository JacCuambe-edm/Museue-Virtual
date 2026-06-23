import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Loader2, Zap, Settings, Activity } from 'lucide-react';
import { api } from '../../services/apiClient';
import PageMetrics from '../ui/PageMetrics';
import CommentSection from '../ui/CommentSection';

const PatrimonioDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        loadItem();
    }, [id]);

    const loadItem = async () => {
        try {
            setLoading(true);
            const data = await api.getPatrimonio(parseInt(id!));
            setItem(data);
        } catch (err: any) {
            setError(err.message || 'Património não encontrado');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 text-lg">{error || 'Património não encontrado'}</p>
                <button onClick={() => navigate(-1)} className="text-orange-600 font-semibold flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
            </div>
        );
    }

    const technicalFields = [
        { label: 'Níveis de Tensão', value: item.niveis_tensao, icon: <Zap className="w-5 h-5" /> },
        { label: 'Potência Instalada (Inicial)', value: item.potencia_instalada_inicial, icon: <Activity className="w-5 h-5" /> },
        { label: 'Potência Instalada (Actual)', value: item.potencia_instalada_actual, icon: <Activity className="w-5 h-5" /> },
        { label: 'Transformadores de Potência', value: item.transformadores_potencia, icon: <Settings className="w-5 h-5" /> },
        { label: 'Barramento Inicial', value: item.barramento_inicial, icon: <MapPin className="w-5 h-5" /> },
        { label: 'Barramento Final', value: item.barramento_final, icon: <MapPin className="w-5 h-5" /> },
        { label: 'Capacidade da Linha', value: item.capacidade_linha, icon: <Zap className="w-5 h-5" /> },
        { label: 'Condutor', value: item.condutor, icon: <Settings className="w-5 h-5" /> },
        { label: 'Comprimento', value: item.comprimento, icon: <Activity className="w-5 h-5" /> },
        { label: 'Circuito', value: item.circuito, icon: <Activity className="w-5 h-5" /> },
        { label: 'Tipo de Postes', value: item.tipo_postes, icon: <Settings className="w-5 h-5" /> },
        { label: 'Tipo de Isoladores', value: item.tipo_isoladores, icon: <Settings className="w-5 h-5" /> },
        { label: 'Cabo de Guarda', value: item.cabo_guarda, icon: <Settings className="w-5 h-5" /> },
    ].filter(f => f.value && f.value !== 'N/A' && f.value !== '');

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Page Header / Back Button */}
            <div className="bg-white border-b sticky top-0 z-30 transition-all duration-300">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Voltar
                    </button>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Detalhes do Património
                    </div>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl mt-8">
                {/* Hero Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="flex flex-col lg:flex-row">
                        {/* Image Side */}
                        <div className="lg:w-1/2 relative h-80 lg:h-auto overflow-hidden">
                            <img 
                                src={item.foto || "/logo.png"} 
                                alt={item.nome}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.src = "/logo.png"; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                <div className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                    {item.tipo}
                                </div>
                                <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                    {item.area_negocio}
                                </div>
                            </div>
                        </div>

                        {/* Title Side */}
                        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                            <div className="border-l-4 border-orange-500 pl-6 mb-8">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{item.nome}</h1>
                                {item.sigla && <p className="text-orange-600 font-bold tracking-widest">{item.sigla}</p>}
                                <div className="mt-6 border-t border-gray-100 pt-4">
                                    <PageMetrics type="heritage" id={item.id} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="text-orange-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Localização</p>
                                        <p className="text-gray-700 font-medium leading-relaxed">{item.localizacao || 'Moçambique'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <ArrowLeft className="text-orange-600 w-5 h-5 rotate-180" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Ano de Entrada em Serviço</p>
                                        <p className="text-gray-700 font-medium leading-relaxed">{item.ano_entrada_servico || 'Não informado'}</p>
                                    </div>
                                </div>
                                
                                {item.nota && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                            <Activity className="text-orange-600 w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Região / Notas</p>
                                            <p className="text-gray-700 font-medium leading-relaxed">{item.nota}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Information Grid */}
                {technicalFields.length > 0 && (
                    <div className="mt-12">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Especificações Técnicas</h2>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {technicalFields.map((field, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                            {field.icon}
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{field.label}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm pl-14">{field.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="mt-12 pb-16">
                    <CommentSection type="heritage" id={item.id} />
                </div>
            </div>
        </div>
    );
};

export default PatrimonioDetail;
