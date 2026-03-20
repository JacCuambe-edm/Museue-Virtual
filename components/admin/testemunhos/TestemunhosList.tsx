import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Loader2, Quote, User, Briefcase } from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useToast } from '../../ui/Toast';

interface Testemunho {
  id: number;
  name: string;
  message: string;
  image: string;
  department: string;
  display_order: number;
}

const TestemunhosList: React.FC = () => {
  const { showToast, ToastComponent } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [testemunhos, setTestemunhos] = useState<Testemunho[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestemunhos();
  }, []);

  const loadTestemunhos = async () => {
    try {
      setLoading(true);
      const data = await api.getTestemunhos();
      setTestemunhos(data || []);
    } catch (error: any) {
      showToast(error.message || 'Erro ao carregar testemunhos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja apagar este testemunho? A ação não pode ser desfeita.')) {
      try {
        await api.deleteTestemunho(id);
        setTestemunhos(testemunhos.filter(t => t.id !== id));
        showToast('Testemunho apagado com sucesso!', 'success');
      } catch (error: any) {
        showToast(error.message || 'Erro ao apagar testemunho.', 'error');
      }
    }
  };

  const getImageUrl = (image: string) => {
    if (!image) return "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200&auto=format&fit=crop";
    return image.startsWith('//') ? `https:${image}` : image;
  };

  const filtered = testemunhos.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <ToastComponent />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórias de Vida (Testemunhos)</h1>
          <p className="mt-1 text-sm text-gray-500">Gerência dos depoimentos de trabalhadores no site público</p>
        </div>
        <Link 
          to="/admin/dashboard/testemunhos/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
        >
          <Plus className="h-4 w-4" />
          Novo Testemunho
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            placeholder="Pesquisar por nome ou anos de trabalho..."
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center p-12 text-gray-500">Nenhum testemunho encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Pessoa</th>
                  <th className="px-6 py-4">Cargo / Anos de Trabalho</th>
                  <th className="px-6 py-4">Testemunho</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-100"
                        />
                        <div className="font-semibold text-gray-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        {item.department || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 max-w-xs truncate" title={item.message}>
                        <Quote className="w-4 h-4 text-orange-400" />
                        {item.message?.substring(0, 40)}{item.message?.length > 40 ? '...' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/admin/dashboard/testemunhos/edit/${item.id}`} 
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestemunhosList;
