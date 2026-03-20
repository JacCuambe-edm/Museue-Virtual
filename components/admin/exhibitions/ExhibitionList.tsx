import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, Calendar, MapPin, ArrowUpRight, Grid, List, User, Loader2 } from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useToast } from '../../ui/Toast';
import ConfirmModal from '../../ui/ConfirmModal';

const ExhibitionList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => { fetchExhibitions(); }, []);

  const fetchExhibitions = async () => {
    try {
      setLoading(true);
      const data = await api.getExposicoes();
      setExhibitions(data);
    } catch (error) {
      console.error('Failed to load exhibitions', error);
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
        await api.deleteExposicao(itemToDelete);
        showToast('Exposição eliminada com sucesso!', 'success');
        setExhibitions(exhibitions.filter(item => item.id !== itemToDelete));
      } catch (error) {
        showToast('Erro ao apagar exposição.', 'error');
      } finally {
        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const getTitle = (item: any) => item.titulo || item.artefatos_expostos || 'Exposição sem título';

  const getStatus = (startDate: string, endDate: string) => {
    if (!startDate) return 'Contínuo';
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    if (start > now) return 'Upcoming';
    if (end && end < now) return 'Past';
    return 'Active';
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700';
      case 'Upcoming': return 'bg-blue-100 text-blue-700';
      case 'Contínuo': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'Active': return 'Em curso';
      case 'Upcoming': return 'Brevemente';
      case 'Contínuo': return 'Permanente';
      default: return 'Terminada';
    }
  };

  const getImageUrl = (image: string) => {
    if (!image) return '';
    return image.startsWith('//') ? `https:${image}` : image;
  };

  const filteredExhibitions = exhibitions.filter(item => {
    const q = searchQuery.toLowerCase();
    return getTitle(item).toLowerCase().includes(q) ||
           item.curador?.toLowerCase().includes(q) ||
           item.localizacao?.toLowerCase().includes(q) ||
           item.descricao?.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto">
      <ToastComponent />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exposições</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie exposições temporárias e permanentes</p>
        </div>
        <Link
          to="/admin/dashboard/exhibitions/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
        >
          <Plus className="h-4 w-4" />
          Nova Exposição
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="Pesquisar exposições..."
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}>
              <Grid className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : filteredExhibitions.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">Nenhuma exposição encontrada.</p>
          <Link to="/admin/dashboard/exhibitions/create" className="inline-flex items-center gap-2 mt-4 text-orange-600 font-medium hover:text-orange-700"><Plus className="w-4 h-4" /> Criar primeira exposição</Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExhibitions.map((item) => {
            const status = getStatus(item.data_inicio, item.data_fim);
            const imgUrl = getImageUrl(item.foto1);
            return (
              <div key={item.id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {imgUrl ? (
                    <img src={imgUrl} alt={getTitle(item)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-400 text-sm">Sem imagem</div>
                  )}
                  <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(status)}`}>
                    {getStatusLabel(status)}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">{getTitle(item)}</h3>
                  <div className="space-y-1.5 text-sm text-gray-500">
                    {item.localizacao && (
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" />{item.localizacao}</div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {item.data_inicio ? new Date(item.data_inicio).toLocaleDateString('pt-MZ') : 'N/A'}
                      {item.data_fim ? ` — ${new Date(item.data_fim).toLocaleDateString('pt-MZ')}` : ''}
                    </div>
                    {item.curador && (
                      <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" />{item.curador}</div>
                    )}
                    <div className="flex items-center gap-2" title="Visualizações">
                      <Eye className="w-4 h-4 text-gray-400" />{item.views || 0} visualizações
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-4 pt-4 border-t border-gray-100">
                    <Link to={`/exposicao/${item.id}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link to={`/admin/dashboard/exhibitions/edit/${item.id}`} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button onClick={() => confirmDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredExhibitions.map((item) => {
              const status = getStatus(item.data_inicio, item.data_fim);
              const imgUrl = getImageUrl(item.foto1);
              return (
                <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  {imgUrl ? (
                    <img src={imgUrl} alt={getTitle(item)} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-orange-50 flex-shrink-0 flex items-center justify-center text-orange-300 text-xs">Sem img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusStyle(status)}`}>{getStatusLabel(status)}</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mt-1 truncate">{getTitle(item)}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                      <span>{item.curador || ''} {item.localizacao ? `• ${item.localizacao}` : ''}</span>
                      <span className="flex items-center gap-1 text-gray-500" title="Visualizações">
                        <Eye className="w-3.5 h-3.5" /> {item.views || 0}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/exposicao/${item.id}`} target="_blank" className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link to={`/admin/dashboard/exhibitions/edit/${item.id}`} className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors">
                      <Edit2 className="h-5 w-5" />
                    </Link>
                    <button onClick={() => confirmDelete(item.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Apagar Exposição"
        message="Tem certeza que deseja apagar esta exposição? Esta acção não pode ser desfeita."
        confirmText="Apagar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
};

export default ExhibitionList;
