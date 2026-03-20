import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, Users, Eye, FileText, Calendar, ArrowUpRight, Package, Image, Landmark, Loader2, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../services/apiClient';

const DashboardHome: React.FC = () => {
  const [statsData, setStatsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [stats, chart] = await Promise.all([
          api.getDashboardStats(),
          api.getDashboardChartData()
      ]);
      setStatsData(stats);
      setChartData(chart);
    } catch (error) {
      console.error('Failed to load dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock stats data (updated with real counts)
  const stats = [
    { name: 'Total Histórias', value: statsData?.counts?.historias || 0, change: '+12%', trend: 'up', icon: FileText, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', path: '/admin/dashboard/stories' },
    { name: 'Visitantes Hoje', value: statsData?.counts?.visitantes || 0, change: '+23%', trend: 'up', icon: Users, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', path: '/admin/dashboard/analytics' },
    { name: 'Visualizações', value: statsData?.counts?.visualizacoes || 0, change: '-3%', trend: 'down', icon: Eye, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', path: '/admin/dashboard/analytics' },
    { name: 'Comentários Pendentes', value: statsData?.counts?.pending_comments || 0, change: 'Revisar', trend: 'up', icon: MessageSquare, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', path: '/admin/dashboard/comments' },
  ];

  // Modules
  const modules = [
    { name: 'Histórias', count: statsData?.counts?.historias || 0, desc: 'Artigos publicados', icon: FileText, path: '/admin/dashboard/stories', createPath: '/admin/dashboard/stories/create', gradient: 'from-blue-500 via-blue-600 to-indigo-600' },
    { name: 'Artefatos', count: statsData?.counts?.artefatos || 0, desc: 'Itens catalogados', icon: Package, path: '/admin/dashboard/artifacts', createPath: '/admin/dashboard/artifacts/create', gradient: 'from-emerald-500 via-emerald-600 to-teal-600' },
    { name: 'Exposições', count: statsData?.counts?.exposicoes || 0, desc: 'Em exibição', icon: Image, path: '/admin/dashboard/exhibitions', createPath: '/admin/dashboard/exhibitions/create', gradient: 'from-purple-500 via-purple-600 to-violet-600' },
    { name: 'Património', count: statsData?.counts?.patrimonios || 0, desc: 'Bens preservados', icon: Landmark, path: '/admin/dashboard/heritage', createPath: '/admin/dashboard/heritage/create', gradient: 'from-amber-500 via-amber-600 to-orange-600' },
    { name: 'Eventos', count: statsData?.counts?.eventos || 0, desc: 'Programação ativa', icon: Calendar, path: '/admin/dashboard/events', createPath: '/admin/dashboard/events/create', gradient: 'from-rose-500 via-rose-600 to-pink-600' },
  ];

  // Recent items
  const recentItems = statsData?.recentActivity || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Bem-vindo ao painel de administração</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Este mês</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const CardTag = stat.path ? Link : 'div';
          return (
          <CardTag to={stat.path as any} key={stat.name} className="relative bg-white block rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 group overflow-hidden cursor-pointer">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-500 group-hover:text-orange-600 transition-colors duration-300">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-3 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stat.change}
                  <span className="text-gray-400 font-normal ml-1">vs ontem</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg shrink-0 transform group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            {/* Decorative gradient */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
          </CardTag>
        )})}
        </div>
      )}

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Visitas Semanais</h3>
              <p className="text-sm text-gray-500">Análise de tráfego</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"></span>
                Visitantes
              </span>
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="views" name="Visualizações" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="likes" name="Gostos" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
            <Link to="/admin/dashboard/stories" className="text-sm text-orange-600 hover:text-orange-700 font-medium">Ver tudo</Link>
          </div>
          <div className="space-y-4">
            {recentItems.length === 0 ? (
               <p className="text-sm text-gray-500 text-center py-4">Nenhuma atividade recente.</p>
            ) : (
              recentItems.slice(0, 5).map((item: any, idx: number) => {
                let linkPath = '#';
                if (item.type === 'História') linkPath = `/admin/dashboard/stories/edit/${item.id}`;
                else if (item.type === 'Artefato') linkPath = `/admin/dashboard/artifacts/edit/${item.id}`;
                else if (item.type === 'Exposição') linkPath = `/admin/dashboard/exhibitions/edit/${item.id}`;
                else if (item.type === 'Comentário') linkPath = `/admin/dashboard/comments`;
                
                return (
                <Link to={linkPath} key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer block">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    item.status === 'new' ? 'bg-emerald-500' : 
                    item.status === 'updated' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.type} • {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" />
                </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Módulos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {modules.map((module) => (
            <div key={module.name} className="group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${module.gradient} mb-4 shadow-lg`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors">{module.name}</h3>
                <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors mt-1">{module.count} {module.desc}</p>
                
                <div className="mt-5 flex gap-2">
                  <Link 
                    to={module.path} 
                    className="flex-1 text-center py-2 text-sm font-medium text-gray-700 group-hover:text-white bg-gray-100 group-hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Ver
                  </Link>
                  <Link 
                    to={module.createPath}
                    className="flex items-center justify-center w-10 h-10 bg-orange-500 group-hover:bg-white text-white group-hover:text-orange-600 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
