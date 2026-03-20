import React, { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Palette, Globe, Loader2 } from 'lucide-react';
import api from '../../services/apiClient';
import { useToast } from '../ui/Toast';

const Settings: React.FC = () => {
  const { showToast, ToastComponent } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const user = api.getCurrentUser();

  // Profile State
  const [profile, setProfile] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cargo: user?.cargo || 'Administrador do Sistema'
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Appearance & Language (Local Storage / UI only for now)
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'Claro');
  const [accentColor, setAccentColor] = useState(localStorage.getItem('app-accent') || 'bg-orange-500');
  const [language, setLanguage] = useState(localStorage.getItem('app-lang') || 'Português');

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'language', label: 'Idioma', icon: Globe },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      if (activeTab === 'profile') {
        await api.updateProfile(profile);
        showToast('Perfil atualizado com sucesso!', 'success');
      } else if (activeTab === 'security') {
        if (!security.newPassword) {
            showToast('Introduza a nova palavra-passe.', 'warning');
            setLoading(false);
            return;
        }
        if (security.newPassword !== security.confirmPassword) {
            showToast('As palavras-passe não coincidem.', 'error');
            setLoading(false);
            return;
        }
        await api.updatePassword({
            currentPassword: security.currentPassword,
            newPassword: security.newPassword
        });
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast('Palavra-passe atualizada!', 'success');
      } else if (activeTab === 'appearance') {
        localStorage.setItem('app-theme', theme);
        localStorage.setItem('app-accent', accentColor);
        showToast('Preferências de aparência guardadas!', 'success');
      } else if (activeTab === 'language') {
        localStorage.setItem('app-lang', language);
        showToast('Idioma alterado com sucesso!', 'success');
      } else {
        showToast('Definições guardadas!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao guardar definições.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToastComponent />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">Gerencie as configurações da sua conta</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold uppercase">
                  {profile.nome.charAt(0) || 'A'}
                </div>
                <div>
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                    Alterar foto
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input 
                    type="text" 
                    value={profile.nome} 
                    onChange={e => setProfile({...profile, nome: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={profile.email} 
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input 
                    type="tel" 
                    value={profile.telefone}
                    onChange={e => setProfile({...profile, telefone: e.target.value})}
                    placeholder="+258 84 000 0000" 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                  <input 
                    type="text" 
                    value={profile.cargo}
                    onChange={e => setProfile({...profile, cargo: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {['Novos conteúdos publicados', 'Novos visitantes', 'Atualizações do sistema', 'Relatórios semanais'].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Palavra-passe atual</label>
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={security.currentPassword}
                    onChange={e => setSecurity({...security, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nova palavra-passe</label>
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={security.newPassword}
                    onChange={e => setSecurity({...security, newPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar palavra-passe</label>
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={security.confirmPassword}
                    onChange={e => setSecurity({...security, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tema</label>
                <div className="flex gap-3">
                  {['Claro', 'Escuro', 'Automático'].map((t) => (
                    <button 
                        key={t} 
                        onClick={() => setTheme(t)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-colors ${theme === t ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <span className="text-sm font-medium">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Cor de destaque</label>
                <div className="flex gap-3">
                  {['bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500'].map((color) => (
                    <button 
                        key={color} 
                        onClick={() => setAccentColor(color)}
                        className={`w-10 h-10 rounded-xl ${color} ${accentColor === color ? 'ring-2 ring-offset-2 ring-orange-500 scale-110 shadow-lg' : 'hover:scale-105'} transition-all`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Idioma do sistema</label>
              <select 
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option>Português</option>
                <option>English</option>
                <option>Español</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
