import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Eye, Heart, MessageSquare, TrendingUp, Calendar, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/apiClient';

const COLORS = ['#f97316', '#8b5cf6', '#10b981', '#3b82f6', '#ec4899'];

const AnalyticsDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('30d');

    useEffect(() => {
        loadData();
    }, [range]);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await api.getAnalyticsDetails(range);
            setData(result);
        } catch (error) {
            console.error('Failed to load analytics', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
            </div>
        );
    }

    const { timeSeries = [], moduleDistribution = [], topPerforming = [], totals = {} } = data || {};

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link to="/admin/dashboard" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Métricas & Analytics</h1>
                        <p className="text-sm text-gray-500 mt-1">Visão aprofundada do engajamento do público</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                    {[
                        { id: '7d', label: '7 Dias' },
                        { id: '30d', label: '30 Dias' },
                        { id: '1y', label: '1 Ano' },
                        { id: 'all', label: 'Sempre' }
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setRange(opt.id)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                range === opt.id 
                                    ? 'bg-purple-50 text-purple-700 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Total Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Visualizações</p>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2">{totals.views || 0}</h2>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <Eye className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Gostos</p>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2">{totals.likes || 0}</h2>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                            <Heart className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-pink-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Comentários</p>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2">{totals.comments || 0}</h2>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Area Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-sm rounded-2xl">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Evolução do Engajamento</h3>
                            <p className="text-sm text-gray-500">Visualizações e Gostos ao longo do tempo</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="views" name="Visualizações" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                                <Area type="monotone" dataKey="likes" name="Gostos" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorLikes)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Origem do Tráfego</h3>
                        <p className="text-sm text-gray-500">Visualizações por módulo</p>
                    </div>
                    <div className="h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={moduleDistribution}
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {moduleDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Performing List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Top 5 Conteúdos Mais Lidos</h3>
                        <p className="text-sm text-gray-500">Os conteúdos que mais atraíram a atenção no período</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-sm text-gray-500">
                                <th className="pb-3 font-medium">Conteúdo</th>
                                <th className="pb-3 font-medium">Tipo</th>
                                <th className="pb-3 font-medium text-right">Visualizações</th>
                                <th className="pb-3 font-medium text-right">Gostos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {topPerforming.map((item: any, idx: number) => (
                                <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs shadow-inner">
                                                #{idx + 1}
                                            </div>
                                            <span className="font-medium text-gray-900 line-clamp-1 max-w-[300px]">{item.titulo}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-gray-500">
                                        <span className={`px-2 py-1 rounded-md text-xs font-semibold
                                            ${item.type === 'História' ? 'bg-blue-50 text-blue-600' :
                                              item.type === 'Artefato' ? 'bg-emerald-50 text-emerald-600' :
                                              item.type === 'Património' ? 'bg-amber-50 text-amber-600' :
                                              item.type === 'Exposição' ? 'bg-purple-50 text-purple-600' :
                                              'bg-rose-50 text-rose-600'
                                            }
                                        `}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-900">
                                            {item.views} <Eye className="w-3.5 h-3.5 text-gray-400" />
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-900">
                                            {item.likes} <Heart className="w-3.5 h-3.5 text-pink-400" />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {topPerforming.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500">
                                        Nenhum dado encontrado no período selecionado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
