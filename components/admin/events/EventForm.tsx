import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bold, Italic, List, Link as LinkIcon, AlignLeft, Type, Loader2, Save } from 'lucide-react';
import api from '../../../services/apiClient';
import { ImageUploadField } from '../../ui/ImageUploadField';
import { DynamicGalleryField } from '../../ui/DynamicGalleryField';
import { useToast } from '../../ui/Toast';

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { showToast, ToastComponent } = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [responsible, setResponsible] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [galeria, setGaleria] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      loadEvent(parseInt(id));
    }
  }, [id, isEditing]);

  const loadEvent = async (eventId: number) => {
    try {
      setLoading(true);
      const data = await api.getEvento(eventId);
      setTitle(data.nome || '');
      setSubtitle(data.subtitulo || '');
      setStartDate(data.data_inicio ? data.data_inicio.split('T')[0] : '');
      setEndDate(data.data_fim ? data.data_fim.split('T')[0] : '');
      setResponsible(data.participantes || ''); 
      setLocation(data.local_evento || '');
      setDescription(data.descricao || '');
      setFoto(data.foto || null);
      if (data.galeria) {
          setGaleria(typeof data.galeria === 'string' ? JSON.parse(data.galeria) : data.galeria);
      }
      setType(data.tipo || '');
    } catch (err) {
      console.error(err);
      showToast('Erro ao carregar evento.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventData = async () => {
    // keeping function body simple
  }

  const handleSubmit = async () => {
    if (!title) {
      showToast('O título (Nome) é obrigatório.', 'warning');
      return;
    }

    setSaving(true);
    const eventData = {
      nome: title,
      subtitulo: subtitle,
      data_inicio: startDate,
      data_fim: endDate,
      participantes: responsible,
      local_evento: location,
      descricao: description,
      tipo: type,
      foto: foto,
      galeria: galeria.filter(url => url.trim() !== ''),
    };

    try {
      if (isEditing) {
        await api.updateEvento(Number(id), eventData);
        showToast('Evento atualizado com sucesso!', 'success');
      } else {
        await api.createEvento(eventData);
        showToast('Evento criado com sucesso!', 'success');
      }
      setTimeout(() => navigate('/admin/dashboard/events'), 2000);
    } catch (error: any) {
      console.error('Erro ao salvar evento:', error);
      showToast(error.message || 'Ocorreu um erro ao salvar o evento.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <ToastComponent />
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/dashboard/events')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Editar evento' : 'Publicar eventos'}</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (

      <div className="space-y-8">
        {/* 1) Top Block: Image Left + Title/Subtitle Right */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Upload - Left */}
          <div className="lg:col-span-1">
             <ImageUploadField
                label="Foto Principal"
                value={foto || ''}
                onChange={setFoto}
                placeholder="URL da imagem (Ex: https://...)"
                required
             />
          </div>

          {/* Title/Subtitle - Right */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter Title"
                className="block w-full px-4 py-3 text-lg border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
              <textarea
                id="subtitle"
                rows={3}
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="Enter Short Description"
                className="block w-full px-4 py-3 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
              />
            </div>
          </div>
        </section>

        {/* 2) Complementary Fields */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select id="type" value={type} onChange={e => setType(e.target.value)} className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500">
              <option value="">Selecione o tipo...</option>
              <option value="seminario">Seminário</option>
              <option value="workshop">Workshop</option>
              <option value="conferencia">Conferência</option>
              <option value="exposicao">Exposição</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Data início</label>
              <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500" />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">Data fim</label>
              <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="responsible" className="block text-sm font-medium text-gray-700 mb-2">Responsável (Participantes)</label>
              <input type="text" id="responsible" value={responsible} onChange={e => setResponsible(e.target.value)} placeholder="Escreva o nome do responsavel" className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Local</label>
              <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Auditório Principal" className="block w-full px-4 py-2 border-[0.5px] border-gray-300 shadow-sm rounded-lg focus:ring-orange-500 focus:border-orange-500" />
            </div>
          </div>
        </section>

        {/* 3) Description Editor */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do evento</label>
          <p className="text-sm text-gray-400 mb-4">Descreva o evento e por coloque a lista dos participantes</p>
          
          <div className="border-[0.5px] border-gray-300 shadow-sm rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b-[0.5px] border-gray-300 flex gap-2">
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Bold className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Italic className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Type className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><AlignLeft className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><List className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><LinkIcon className="w-4 h-4" /></button>
            </div>
            <textarea rows={10} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-4 focus:outline-none resize-y min-h-[250px]" placeholder="Conteúdo do evento e lista de participantes..."></textarea>
          </div>
        </section>

        {/* 4) Dynamic Gallery */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <DynamicGalleryField 
             images={galeria}
             onChange={setGaleria}
          />
        </section>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard/events')}
            className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || loading}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'Salvar Alterações' : 'Criar Evento'}
          </button>
        </div>

      </div>
      )}
    </div>
  );
};

export default EventForm;
