import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Quote, User, Briefcase, ListOrdered } from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useToast } from '../../ui/Toast';
import { ImageUploadField } from '../../ui/ImageUploadField';

const TestemunhoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    message: '',
    image: '',
    display_order: 0
  });

  useEffect(() => {
    if (id) {
      loadTestemunho();
    }
  }, [id]);

  const loadTestemunho = async () => {
    try {
      const data = await api.getTestemunho(parseInt(id!));
      if (data) {
        setFormData({
          name: data.name || '',
          department: data.department || '',
          message: data.message || '',
          image: data.image || '',
          display_order: data.display_order || 0
        });
      } else {
        showToast('Testemunho não encontrado.', 'error');
        navigate('/admin/dashboard/testemunhos');
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao carregar testemunho.', 'error');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'display_order' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.updateTestemunho(parseInt(id), formData);
        showToast('Testemunho atualizado com sucesso!', 'success');
      } else {
        await api.createTestemunho(formData);
        showToast('Testemunho criado com sucesso!', 'success');
      }
      setTimeout(() => navigate('/admin/dashboard/testemunhos'), 1500);
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar testemunho.', 'error');
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <ToastComponent />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/admin/dashboard/testemunhos"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Editar Testemunho' : 'Novo Testemunho'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {id ? 'Altere as informações do autor e o texto do testemunho.' : 'Adicione uma nova História de Vida para mostrar no site.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Esquerda: Upload de Imagem */}
            <div className="space-y-4">
              <ImageUploadField 
                label="Foto do Testemunho"
                value={formData.image}
                onChange={handleImageUpload}
              />
              <p className="text-xs text-gray-500 text-center mt-2">
                Use imagens reais como os retratos da EDM. Proporção recomendada: 3:4.
              </p>
            </div>

            {/* Direita: Campos de Texto */}
            <div className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" />
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="Nome do Trabalhador"
                />
              </div>

              {/* Cargo / Anos */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-orange-500" />
                  Cargo e Anos de Trabalho
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="Ex: Engenheiro Sênior, 25 anos de casa"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-orange-500" />
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="0, 1, 2..."
                />
              </div>
            </div>
          </div>

          {/* Testemunho (Algumas Palavras) */}
          <div className="pt-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Quote className="w-4 h-4 text-orange-500" />
              Algumas Palavras (Citação)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
              placeholder="Trabalhar na EDM tem sido uma jornada..."
            />
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Link
              to="/admin/dashboard/testemunhos"
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
              {loading ? 'A salvar...' : 'Salvar Testemunho'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestemunhoForm;
