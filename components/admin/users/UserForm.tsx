import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Shield, User, Key, Mail, Building, Briefcase } from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useToast } from '../../ui/Toast';

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    bio: '',
    category: '',
    role: 'editor'
  });

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      const data = await api.getUsers();
      // Since there's no api.getUser(id) currently in apiClient, we filter from getUsers 
      const user = data.find((u: any) => u.id === parseInt(id));
      if (user) {
        setFormData({
          email: user.email || '',
          password: '', // blank password on edit
          bio: user.bio || '',
          category: user.category || '',
          role: user.role || 'editor'
        });
      } else {
        showToast('Utilizador não encontrado.', 'error');
        navigate('/admin/dashboard/users');
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao carregar utilizador.', 'error');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        // Prevent accidental email/role change payload for Master Admin
        const payload = { ...formData };
        if (parseInt(id) === 1) {
          delete payload.email;
          delete payload.role;
        }
        if (!payload.password) delete payload.password; // Ignore password if blank on edit
        
        await api.updateUser(parseInt(id), payload);
        showToast('Utilizador atualizado com sucesso!', 'success');
      } else {
        await api.createUser(formData);
        showToast('Utilizador criado com sucesso!', 'success');
      }
      setTimeout(() => navigate('/admin/dashboard/users'), 1500);
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar utilizador.', 'error');
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  const isMaster = id && parseInt(id) === 1;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <ToastComponent />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/admin/dashboard/users"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Editar Utilizador' : 'Novo Utilizador'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {id ? 'Altere as informações deste perfil.' : 'Crie um novo acesso ao sistema do museu.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isMaster}
                required={!isMaster}
                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all ${isMaster ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="email@museu.cd"
              />
              {isMaster && <p className="text-xs text-orange-500 mt-1">O email do master não pode ser alterado.</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-orange-500" />
                Password {id && <span className="text-gray-400 font-normal text-xs">(Deixe em branco para manter)</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!id}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-500" />
                Nível de Permissão
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isMaster}
                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all ${isMaster ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="viewer">Visualizador (Leitura)</option>
                <option value="editor">Editor (Gerenciar Conteúdo)</option>
                <option value="admin">Administrador (Total)</option>
              </select>
            </div>

            {/* Category / Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-orange-500" />
                Área de Negócio Responsável
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                placeholder="Ex: Geração, Transporte..."
              />
            </div>
          </div>

          {/* Bio / Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-orange-500" />
              Nome / Notas / Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
              placeholder="Nome do utilizador, cargo ou responsabilidades..."
            />
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Link
              to="/admin/dashboard/users"
              className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {loading ? 'A salvar...' : 'Salvar Utilizador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
