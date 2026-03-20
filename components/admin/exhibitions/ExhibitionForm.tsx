import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../services/apiClient';
import {
  ArrowLeft,
  Upload,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  AlignLeft,
  Type,
  Loader2,
  Save
} from 'lucide-react';
import { ImageUploadField } from '../../ui/ImageUploadField';
import { DynamicGalleryField } from '../../ui/DynamicGalleryField';
import { useToast } from '../../ui/Toast';

const ExhibitionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { showToast, ToastComponent } = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [curador, setCurador] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [artefatosExpostos, setArtefatosExpostos] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto1, setFoto1] = useState('');
  const [foto2, setFoto2] = useState('');
  const [galeria, setGaleria] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      loadExhibition(parseInt(id));
    }
  }, [id, isEditing]);

  const loadExhibition = async (exhId: number) => {
    try {
      setLoading(true);
      const data = await api.getExposicao(exhId);
      setTitulo(data.titulo || data.artefatos_expostos || '');
      setCurador(data.curador || '');
      setResponsavel(data.responsavel || '');
      setLocalizacao(data.localizacao || '');
      setStartDate(data.data_inicio ? data.data_inicio.split('T')[0] : '');
      setEndDate(data.data_fim ? data.data_fim.split('T')[0] : '');
      setArtefatosExpostos(data.artefatos_expostos || '');
      setDescricao(data.descricao || '');
      setFoto1(data.foto1 || '');
      setFoto2(data.foto2 || '');
      if (data.galeria) {
          setGaleria(typeof data.galeria === 'string' ? JSON.parse(data.galeria) : data.galeria);
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao carregar a exposição.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!titulo.trim()) {
      showToast('O título é obrigatório.', 'warning');
      return;
    }

    const payload = {
      curador: curador,
      descricao: descricao,
      artefatos_expostos: artefatosExpostos || titulo,
      foto1: foto1,
      foto2: foto2,
      data_inicio: startDate || null,
      data_fim: endDate || null,
      titulo: titulo,
      localizacao: localizacao,
      responsavel: responsavel,
      galeria: galeria.filter(url => url.trim() !== ''),
    };

    try {
      setSaving(true);
      if (isEditing && id) {
        await api.updateExposicao(parseInt(id), payload);
      } else {
        await api.createExposicao(payload);
      }
      navigate('/admin/dashboard/exhibitions');
    } catch (err: any) {
      console.error(err);
      showToast('Erro ao salvar: ' + (err.message || 'Erro desconhecido'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <ToastComponent />
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard/exhibitions')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Editar exposição' : 'Nova exposição'}</h1>
            <p className="text-sm text-gray-500">{isEditing ? 'Atualize os detalhes' : 'Crie uma nova exposição'}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
      <div className="space-y-6">

        {/* Image URLs */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Imagens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
             <ImageUploadField
                label="URL da Imagem de Capa (foto1)"
                value={foto1}
                onChange={setFoto1}
                placeholder="/exposicoes/45anos/foto.png"
             />
             <ImageUploadField
                label="URL da Segunda Imagem (foto2)"
                value={foto2}
                onChange={setFoto2}
                placeholder="/exposicoes/45anos/foto2.png"
             />
          </div>
        </section>

        {/* Main Fields */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título da Exposição *
            </label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: 45 Anos com Exposição Museológica"
              className="block w-full px-4 py-3 bg-gray-50 border-[0.5px] border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="curador" className="block text-sm font-medium text-gray-700 mb-2">
                Curador / Organizador
              </label>
              <input
                type="text"
                id="curador"
                value={curador}
                onChange={e => setCurador(e.target.value)}
                placeholder="Ex: Centro Cultural da EDM"
                className="block w-full px-4 py-3 bg-gray-50 border-[0.5px] border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 mb-2">
                Responsável
              </label>
              <input
                type="text"
                id="responsavel"
                value={responsavel}
                onChange={e => setResponsavel(e.target.value)}
                placeholder="Ex: Direcção de Comunicação e Imagem"
                className="block w-full px-4 py-3 bg-gray-50 border-[0.5px] border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <input
                type="text"
                id="localizacao"
                value={localizacao}
                onChange={e => setLocalizacao(e.target.value)}
                placeholder="Ex: Sede da EDM, Maputo"
                className="block w-full px-4 py-3 bg-gray-50 border-[0.5px] border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50 border-[0.5px] border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50 border-[0.5px] border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
        </section>

        {/* Description Editor */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição da exposição</label>
          <p className="text-xs text-gray-400 mb-4">Descreva em detalhe o conteúdo e o contexto da exposição</p>

          <div className="border-[0.5px] border-gray-300 shadow-sm rounded-xl overflow-hidden">
             {/* Toolbar */}
             <div className="bg-gray-50 px-3 py-2 border-b-[0.5px] border-gray-300 flex gap-2">
               <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Bold className="w-4 h-4" /></button>
               <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Italic className="w-4 h-4" /></button>
               <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Type className="w-4 h-4" /></button>
               <div className="w-px h-6 bg-gray-300 mx-1"></div>
               <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><AlignLeft className="w-4 h-4" /></button>
               <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><List className="w-4 h-4" /></button>
               <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><LinkIcon className="w-4 h-4" /></button>
             </div>
             {/* Editor Area */}
             <textarea
                rows={10}
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                className="w-full p-4 focus:outline-none resize-y min-h-[250px]"
                placeholder="Conteúdo da exposição..."
             ></textarea>
          </div>
        </section>

        {/* Dynamic Gallery */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <DynamicGalleryField 
             images={galeria}
             onChange={setGaleria}
          />
        </section>

        {/* Action Buttons - Standardized Bottom Layout */}
        <div className="flex items-center justify-end gap-3 pt-4 mt-8 border-t border-gray-200">
           <button
             type="button"
             onClick={() => navigate('/admin/dashboard/exhibitions')}
             className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
           >
             Cancelar
           </button>
           <button
             type="button"
             onClick={handleSave}
             disabled={saving}
             className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50 flex items-center gap-2"
           >
             {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {isEditing ? 'Salvar Alterações' : 'Criar Exposição'}
           </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default ExhibitionForm;
