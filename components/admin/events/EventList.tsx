import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, User, Loader2, Eye } from 'lucide-react';
import api from '../../../services/apiClient';
import ConfirmModal from '../../ui/ConfirmModal';
import { useToast } from '../../ui/Toast';

interface Event {
  id: number;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  responsible: string;
  image: string;
  status: 'Upcoming' | 'Ongoing' | 'Past';
}

const EventList: React.FC = () => {
  const { showToast, ToastComponent } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEventos();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events', error);
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
        await api.deleteEvento(itemToDelete);
        showToast('Evento eliminado com sucesso!', 'success');
        setEvents(events.filter(e => e.id !== itemToDelete));
      } catch (error) {
        showToast('Erro ao apagar evento.', 'error');
      } finally {
        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const getStatus = (startDate: string, endDate: string) => {
    if (!startDate) return 'Upcoming';
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    if (start > now) return 'Upcoming';
    if (end && end < now) return 'Past';
    return 'Ongoing';
  };

  const getImageUrl = (image: string) => {
    if (!image) return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=300";
    return image.startsWith('//') ? `https:${image}` : image;
  };

  const filteredEvents = events.filter(e => 
    e.nome?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.local_evento?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <ToastComponent />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie os eventos e atividades do museu</p>
        </div>
        <Link 
          to="/admin/dashboard/events/create"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Buscar eventos..."
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center p-12 text-gray-500">Nenhum evento encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const status = getStatus(event.data_inicio, event.data_fim);
            return (
              <div key={event.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 w-full relative">
                  <img src={getImageUrl(event.foto)} alt={event.nome} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full ${
                    status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                    status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {status === 'Upcoming' ? 'Brevemente' : status === 'Ongoing' ? 'Em curso' : 'Terminado'}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mt-1 mb-3">{event.nome}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.subtitulo}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {event.data_inicio ? new Date(event.data_inicio).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {event.local_evento || 'N/A'}
                    </div>
                    <div className="flex items-center text-gray-500" title="Visualizações">
                      <Eye className="h-4 w-4 mr-2 text-gray-400" />
                      {event.views || 0} visualizações
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                    <Link to={`/evento/${event.id}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link to={`/admin/dashboard/events/edit/${event.id}`} className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                    <button onClick={() => confirmDelete(event.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Apagar Evento"
        message="Tem certeza que deseja apagar este evento? Esta acção não pode ser desfeita."
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

export default EventList;
