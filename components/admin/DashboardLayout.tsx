import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Package,
  Image,
  Landmark,
  Calendar,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Zap,
  ChevronRight,
  Settings,
  MessageSquare,
  PieChart,
  ArrowUpRight,
  Users,
  Quote,
  Activity
} from 'lucide-react';
import { api } from '../../services/apiClient';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const location = useLocation();
  const currentUser = api.getCurrentUser();
  const isMasterAdmin = currentUser?.email === 'admin@museu.cd';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const stats = await api.getDashboardStats();
        setNotifications(stats.recentActivity || []);
      } catch (err) {
        console.error('Erro ao buscar notificações:', err);
      }
    };
    fetchNotifications();
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { name: 'Analytics', icon: PieChart, path: '/admin/dashboard/analytics' },
    { name: 'Logs de Actividade', icon: Activity, path: '/admin/dashboard/logs' },
    { name: 'Histórias', icon: BookOpen, path: '/admin/dashboard/stories' },
    { name: 'Artefatos', icon: Package, path: '/admin/dashboard/artifacts' },
    { name: 'Exposições', icon: Image, path: '/admin/dashboard/exhibitions' },
    { name: 'Património', icon: Landmark, path: '/admin/dashboard/heritage' },
    { name: 'Eventos', icon: Calendar, path: '/admin/dashboard/events' },
    { name: 'Testemunhos', icon: Quote, path: '/admin/dashboard/testemunhos' },
    { name: 'Comentários', icon: MessageSquare, path: '/admin/dashboard/comments' },
    { name: 'Configurações', icon: Settings, path: '/admin/dashboard/settings' },
  ];

  if (isMasterAdmin) {
    menuItems.splice(8, 0, { name: 'Utilizadores', icon: Users, path: '/admin/dashboard/users' });
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg shadow-orange-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">Museu Virtual</span>
            <span className="block text-xs text-gray-400">Painel Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-500'}`} />
                <span className="font-medium">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold uppercase">
              {currentUser?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.bio || (isMasterAdmin ? 'Master Admin' : 'Utilizador')}
              </p>
              <p className="text-xs text-gray-500 truncate">{currentUser?.email || 'Sem email'}</p>
            </div>
          </div>
          <Link
            to="/admin/login"
            onClick={() => api.logout()}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Terminar Sessão
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={toggleSidebar}></div>
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">Museu Virtual</span>
              </div>
              <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl w-80">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1"
              />
              <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 bg-white rounded border border-gray-200">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.some(n => n.status === 'new') && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h4 className="font-semibold text-gray-900">Notificações</h4>
                      <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                        {notifications.length} Recentes
                      </span>
                    </div>
                    <div className="max-h-96 overflow-y-auto w-full">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          Nenhuma notificação no momento.
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {notifications.map((item: any, idx: number) => {
                            let linkPath = '#';
                            if (item.type === 'História') linkPath = `/admin/dashboard/stories/edit/${item.id}`;
                            else if (item.type === 'Artefato') linkPath = `/admin/dashboard/artifacts/edit/${item.id}`;
                            else if (item.type === 'Exposição') linkPath = `/admin/dashboard/exhibitions/edit/${item.id}`;
                            else if (item.type === 'Comentário') linkPath = `/admin/dashboard/comments`;
                            
                            return (
                              <Link 
                                to={linkPath} 
                                key={idx} 
                                onClick={() => setShowNotifications(false)}
                                className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors group cursor-pointer"
                              >
                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                                  item.status === 'new' ? 'bg-emerald-500' : 
                                  item.status === 'updated' ? 'bg-amber-500' : 'bg-blue-500'
                                }`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">{item.title}</p>
                                  <p className="text-xs text-gray-500 mt-1">{item.type} • {new Date(item.created_at).toLocaleDateString()}</p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors shrink-0" />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                      <Link to="/admin/dashboard/stories" onClick={() => setShowNotifications(false)} className="text-sm font-medium text-orange-600 hover:text-orange-700">Ver todas</Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Avatar - Mobile */}
            <div className="lg:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
