import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    Users, Eye, Clock, TrendingUp, Monitor, Smartphone, Tablet,
    Download, RefreshCw, Search, ChevronLeft, ChevronRight,
    Globe, ExternalLink, X
} from 'lucide-react';
import { api } from '../../../services/apiClient';

const COLORS = ['#F16624', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

function formatDuration(seconds: number): string {
    if (!seconds || seconds < 0) return '0s';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function formatDate(dt: string): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const DeviceIcon: React.FC<{ type: string }> = ({ type }) => {
    if (type === 'mobile') return <Smartphone className="w-4 h-4 text-blue-500" />;
    if (type === 'tablet') return <Tablet className="w-4 h-4 text-purple-500" />;
    return <Monitor className="w-4 h-4 text-gray-500" />;
};

// ─── Session Detail Modal ────────────────────────────────────────────────────
const SessionModal: React.FC<{ session: any; onClose: () => void }> = ({ session, onClose }) => {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getSessionPages(session.session_id)
            .then(setPages)
            .catch(() => setPages([]))
            .finally(() => setLoading(false));
    }, [session.session_id]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Detalhe da Sessão</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{session.ip_address} · {session.browser} · {session.os}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-100">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-500">{session.total_pages}</p>
                        <p className="text-xs text-gray-500 mt-1">Páginas visitadas</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-500">{formatDuration(session.duration_seconds)}</p>
                        <p className="text-xs text-gray-500 mt-1">Duração total</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-500">{session.device_type}</p>
                        <p className="text-xs text-gray-500 mt-1">Dispositivo</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Percurso de navegação</h4>
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">A carregar...</div>
                    ) : pages.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">Sem registos de páginas</div>
                    ) : (
                        <div className="space-y-2">
                            {pages.map((p, i) => (
                                <div key={p.id} className="flex items-start gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                                        {i < pages.length - 1 && <div className="w-px h-4 bg-gray-200 mt-1" />}
                                    </div>
                                    <div className="flex-1 bg-gray-50 rounded-xl p-3">
                                        <p className="text-sm font-medium text-gray-800">{p.page_title || p.page_path}</p>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-xs text-gray-400">{p.page_path}</span>
                                            <span className="text-xs text-gray-400 ml-auto">{formatDuration(p.time_spent_seconds)} · {formatDate(p.visited_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Dashboard ──────────────────────────────────────────────────────────
const LogsDashboard: React.FC = () => {
    const [summary, setSummary] = useState<any>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [range, setRange] = useState('30d');
    const [device, setDevice] = useState('');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [exporting, setExporting] = useState(false);

    const loadSummary = useCallback(() => {
        setLoading(true);
        api.getLogsSummary()
            .then(setSummary)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const loadSessions = useCallback((page = 1) => {
        setSessionsLoading(true);
        api.getLogsSessions({ page, limit: 15, range, device, search })
            .then((data: any) => {
                setSessions(data.sessions || []);
                setPagination({ page: data.page, pages: data.pages, total: data.total });
            })
            .catch(() => {})
            .finally(() => setSessionsLoading(false));
    }, [range, device, search]);

    useEffect(() => { loadSummary(); }, [loadSummary]);
    useEffect(() => { loadSessions(1); }, [loadSessions]);

    const handleExport = () => {
        setExporting(true);
        const url = api.getLogsExportUrl(range);
        const a = document.createElement('a');
        a.href = url;
        a.click();
        setTimeout(() => setExporting(false), 2000);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
    };

    const totals = summary?.totals || {};
    const topPages = summary?.topPages || [];
    const byDay = (summary?.byDay || []).map((d: any) => ({ name: d.day?.slice(5), sessoes: d.sessions }));
    const byDevice = (summary?.byDevice || []).map((d: any) => ({
        name: d.device_type === 'desktop' ? 'Desktop' : d.device_type === 'mobile' ? 'Mobile' : d.device_type === 'tablet' ? 'Tablet' : 'Outro',
        value: d.total
    }));
    const byBrowser = (summary?.byBrowser || []).map((b: any) => ({ name: b.browser, value: b.total }));

    return (
        <div className="space-y-8">
            {selectedSession && (
                <SessionModal session={selectedSession} onClose={() => setSelectedSession(null)} />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Logs de Actividade</h1>
                    <p className="text-gray-500 text-sm mt-1">Monitorização de visitantes e comportamento na plataforma</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={range}
                        onChange={e => setRange(e.target.value)}
                        className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                    >
                        <option value="1d">Hoje</option>
                        <option value="7d">Últimos 7 dias</option>
                        <option value="30d">Últimos 30 dias</option>
                        <option value="90d">Últimos 90 dias</option>
                        <option value="all">Tudo</option>
                    </select>
                    <button onClick={loadSummary} className="p-2 hover:bg-gray-100 rounded-xl" title="Atualizar">
                        <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-60"
                    >
                        <Download className="w-4 h-4" />
                        {exporting ? 'A exportar...' : 'Exportar CSV'}
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Sessões totais', value: totals.total_sessions ?? '—', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
                    { label: 'Visitantes únicos', value: totals.unique_visitors ?? '—', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Duração média', value: totals.avg_duration ? formatDuration(totals.avg_duration) : '—', icon: Clock, color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Total de pageviews', value: totals.total_pageviews ?? '—', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50' },
                ].map(card => (
                    <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{loading ? '...' : card.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sessions by Day */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-500" /> Sessões por dia
                    </h3>
                    {loading ? (
                        <div className="h-48 flex items-center justify-center text-gray-400">A carregar...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={byDay} barSize={16}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="sessoes" fill="#F16624" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Device breakdown */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-6">Dispositivos</h3>
                    {loading ? (
                        <div className="h-48 flex items-center justify-center text-gray-400">A carregar...</div>
                    ) : byDevice.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-gray-400">Sem dados</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={byDevice} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                                    {byDevice.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Top Pages + Browsers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-5">Páginas mais visitadas</h3>
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">A carregar...</div>
                    ) : topPages.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">Sem dados</div>
                    ) : (
                        <div className="space-y-3">
                            {topPages.map((p: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{p.page_title || p.page_path}</p>
                                        <p className="text-xs text-gray-400 truncate">{p.page_path}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-bold text-orange-500">{p.visits}</p>
                                        <p className="text-xs text-gray-400">{formatDuration(p.avg_time)} méd.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Browsers */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-5">Browsers utilizados</h3>
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">A carregar...</div>
                    ) : byBrowser.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">Sem dados</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={byBrowser} layout="vertical" barSize={14}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11 }} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                                <Tooltip />
                                <Bar dataKey="value" name="Sessões" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Sessions Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Sessões recentes <span className="text-gray-400 font-normal text-sm">({pagination.total} total)</span></h3>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <select
                            value={device}
                            onChange={e => setDevice(e.target.value)}
                            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >
                            <option value="">Todos os dispositivos</option>
                            <option value="desktop">Desktop</option>
                            <option value="mobile">Mobile</option>
                            <option value="tablet">Tablet</option>
                        </select>
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1 sm:flex-initial">
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl flex-1">
                                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="IP ou browser..."
                                    value={searchInput}
                                    onChange={e => setSearchInput(e.target.value)}
                                    className="bg-transparent text-sm focus:outline-none w-full"
                                />
                            </div>
                            <button type="submit" className="px-3 py-2 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600">Filtrar</button>
                        </form>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Visitante</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Dispositivo</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Browser / OS</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-600">Páginas</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-600">Duração</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Início</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessionsLoading ? (
                                <tr><td colSpan={7} className="text-center py-12 text-gray-400">A carregar...</td></tr>
                            ) : sessions.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-12 text-gray-400">Nenhuma sessão encontrada</td></tr>
                            ) : sessions.map((s: any) => (
                                <tr key={s.session_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800">{s.ip_address || '—'}</p>
                                        {s.referrer && (
                                            <p className="text-xs text-gray-400 truncate max-w-[160px]" title={s.referrer}>{s.referrer}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <DeviceIcon type={s.device_type} />
                                            <span className="text-gray-600 capitalize">{s.device_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-gray-800">{s.browser} {s.browser_version}</p>
                                        <p className="text-xs text-gray-400">{s.os}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-50 text-orange-600 rounded-full font-bold text-xs">
                                            {s.total_pages}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700 font-medium">
                                        {formatDuration(s.duration_seconds)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                        {formatDate(s.started_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedSession(s)}
                                            className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-700 font-medium"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" /> Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">Página {pagination.page} de {pagination.pages}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => loadSessions(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="p-2 hover:bg-gray-100 rounded-xl disabled:opacity-40"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                                onClick={() => loadSessions(pagination.page + 1)}
                                disabled={pagination.page >= pagination.pages}
                                className="p-2 hover:bg-gray-100 rounded-xl disabled:opacity-40"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogsDashboard;
