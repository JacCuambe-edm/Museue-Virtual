import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Grid, List, Loader2, Image as ImageIcon, Eye } from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useToast } from '../../ui/Toast';
import ConfirmModal from '../../ui/ConfirmModal';

const ArtifactList: React.FC = () => {
  const { showToast, ToastComponent } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const fetchArtifacts = async () => {
    try {
      setLoading(true);
      const data = await api.getArtefatos();
      setArtifacts(data);
    } catch (error) {
      console.error('Failed to load artifacts', error);
      showToast('Falha ao carregar artefatos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (itemToDelete !== null) {
      try {
        await api.deleteArtefato(itemToDelete);
        showToast('Artefato eliminado com sucesso!', 'success');
        setArtifacts(artifacts.filter(a => a.id !== itemToDelete));
      } catch (error) {
        showToast('Erro ao eliminar artefato.', 'error');
      } finally {
        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const getImageUrl = (image: string) => {
    if (!image) return "";
    return image.startsWith('//') ? `https:${image}` : image;
  };

  const filteredArtifacts = artifacts.filter(a => {
    const title = a.titulo || a.nome || '';
    const category = a.categoria || '';
    const origin = a.local_origem || a.origem || '';
    
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           category.toLowerCase().includes(searchQuery.toLowerCase()) ||
           origin.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto">
      <ToastComponent />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artefatos</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie o acervo de artefatos do museu</p>
        </div>
        <Link to="/admin/dashboard/artifacts/create" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all">
          <Plus className="h-4 w-4" />
          Novo Artefato
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
              placeholder="Pesquisar artefatos..." 
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}><Grid className="w-5 h-5" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}><List className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : filteredArtifacts.length === 0 ? (
        <div className="text-center p-12 text-gray-500 bg-white rounded-2xl border border-gray-200">
          Nenhum artefato encontrado.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtifacts.map((artifact) => (
            <div key={artifact.id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {(artifact.foto || artifact.foto1) ? (
                  <img src={getImageUrl(artifact.foto || artifact.foto1)} alt={artifact.titulo || artifact.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.png'; e.currentTarget.className = 'w-12 h-12 object-contain opacity-20 absolute inset-0 m-auto'; }} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 uppercase tracking-tighter text-xs">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                    Sem Imagem
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="text-sm text-orange-600 font-medium">{artifact.categoria}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">{artifact.titulo || artifact.nome || 'Sem título'}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-1 flex items-center gap-3">
                  <span>{(artifact.local_origem || artifact.origem) || 'Origem desconhecida'} • {artifact.data_aquisicao || 'Data N/D'}</span>
                  <span className="flex items-center gap-1 text-gray-400" title="Visualizações"><Eye className="w-3.5 h-3.5" /> {artifact.views || 0}</span>
                </p>
                <div className="flex items-center justify-end gap-1 mt-4 pt-4 border-t border-gray-100">
                  <Link to={`/artefato/${artifact.id}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="h-4 w-4" /></Link>
                  <Link to={`/admin/dashboard/artifacts/edit/${artifact.id}`} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"><Edit2 className="h-4 w-4" /></Link>
                  <button onClick={() => confirmDelete(artifact.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredArtifacts.map((artifact) => (
              <div key={artifact.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                  {(artifact.foto || artifact.foto1) ? (
                    <img src={getImageUrl(artifact.foto || artifact.foto1)} alt={artifact.titulo || artifact.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-orange-600 font-medium">{artifact.categoria}</span>
                  <h3 className="text-base font-semibold text-gray-900 mt-1 truncate">{artifact.titulo || artifact.nome || 'Sem título'}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                    <span>{(artifact.local_origem || artifact.origem) || 'N/D'} • {artifact.data_aquisicao || 'N/D'}</span>
                    <span className="flex items-center gap-1 text-gray-400" title="Visualizações"><Eye className="w-3.5 h-3.5" /> {artifact.views || 0}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/artefato/${artifact.id}`} target="_blank" className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Eye className="h-5 w-5" /></Link>
                  <Link to={`/admin/dashboard/artifacts/edit/${artifact.id}`} className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"><Edit2 className="h-5 w-5" /></Link>
                  <button onClick={() => confirmDelete(artifact.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="h-5 w-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Apagar Artefato"
        message="Tem certeza que deseja apagar este artefato? Esta acção não pode ser desfeita."
        confirmText="Apagar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ArtifactList;
