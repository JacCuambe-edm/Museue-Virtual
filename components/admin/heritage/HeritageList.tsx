import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Grid, List, Loader2, Image as ImageIcon, Eye } from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useToast } from '../../ui/Toast';

interface Heritage {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  state: string;
  image: string;
}

const HeritageList: React.FC = () => {
  const { showToast, ToastComponent } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await api.getPatrimonios();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja apagar este item?')) {
      try {
        await api.deletePatrimonio(id);
        showToast('Patrimônio eliminado com sucesso!', 'success');
        loadItems(); // Refresh the list after deletion
      } catch (error) {
        showToast('Erro ao apagar patrimônio.', 'error');
      }
    }
  };

  const filteredItems = items.filter(item => 
    item.area_negocio?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.circuito?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.descricao?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <ToastComponent />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Património</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie o acervo e património técnico do museu</p>
        </div>
        <Link to="/admin/dashboard/heritage/create" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all">
          <Plus className="h-4 w-4" />
          Novo Património
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" placeholder="Pesquisar património..." />
          </div>
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}><Grid className="w-5 h-5" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}><List className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' && (
        loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center p-12 text-gray-500">Nenhum património encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {item.foto ? (
                    <img src={item.foto} alt={item.circuito} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                       <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                       <span className="text-xs font-medium uppercase tracking-wider">Sem Imagem</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-orange-600 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm border border-orange-100">
                      {item.area_negocio || 'Geral'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-1">{item.nome || 'Património sem nome'}</h3>
                  <div className="flex flex-col gap-1 mt-3">
                    <div className="flex items-center text-xs text-gray-500 gap-1.5">
                       <span className="font-semibold text-gray-700">Ano:</span>
                       {item.ano_entrada_servico || 'N/A'}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 gap-1.5">
                       <span className="font-semibold text-gray-700">Capacidade:</span>
                       {item.capacidade_linha || 'N/A'}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 gap-1.5" title="Visualizações">
                       <Eye className="w-3.5 h-3.5 text-gray-400" />
                       <span>{item.views || 0} visualizações</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {item.descricao || 'Sem descrição disponível.'}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-4 pt-4 border-t border-gray-100">
                    <Link to={`/patrimonio/${item.id}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="h-4 w-4" /></Link>
                    <Link to={`/admin/dashboard/heritage/edit/${item.id}`} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"><Edit2 className="h-4 w-4" /></Link>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {viewMode === 'list' && (
        loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center p-12 text-gray-500">Nenhum património encontrado.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100">
                    {item.foto ? (
                      <img src={item.foto} alt={item.circuito} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">S/ Img</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <h3 className="text-base font-bold text-gray-900 truncate">{item.nome || 'Património sem nome'}</h3>
                       <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-md">{item.area_negocio || 'Geral'}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate max-w-xl">{item.descricao || 'Sem descrição.'}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                       <span className="text-xs text-gray-400"><span className="font-semibold">Ano:</span> {item.ano_entrada_servico}</span>
                       <span className="text-xs text-gray-400"><span className="font-semibold">Linha:</span> {item.capacidade_linha}</span>
                       <span className="flex items-center gap-1 text-xs text-gray-400" title="Visualizações"><Eye className="w-3.5 h-3.5" /> {item.views || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/patrimonio/${item.id}`} target="_blank" className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Eye className="h-5 w-5" /></Link>
                    <Link to={`/admin/dashboard/heritage/edit/${item.id}`} className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"><Edit2 className="h-5 w-5" /></Link>
                    <button onClick={() => handleDelete(item.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="h-5 w-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default HeritageList;
