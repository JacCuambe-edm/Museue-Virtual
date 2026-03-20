import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bold, Italic, List, Link as LinkIcon, AlignLeft, Type, Save, Loader2 } from 'lucide-react';
import api from '../../../services/apiClient';
import { ImageUploadField } from '../../ui/ImageUploadField';
import { DynamicGalleryField } from '../../ui/DynamicGalleryField';
import { useToast } from '../../ui/Toast';

const ArtifactForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { showToast, ToastComponent } = useToast();

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    area_negocio: '',
    data_aquisicao: '',
    origem: '',
    localizacao: '',
    estado_conservacao: '',
    material: '',
    dimensoes: '',
    responsavel: '',
    descricao: '',
    foto: '',
    galeria: [] as string[],
  });

  const categoriasByArea: Record<string, string[]> = {
    'Geração': ['Equipamento', 'Instrumento', 'Documento', 'Fotografia'],
    'Transporte': ['Cabos', 'Veículos', 'Ferramentas', 'Equipamento', 'Documento'],
    'Distribuição': ['Contadores', 'Medidores', 'Redes', 'Equipamento', 'Documento'],
    'Comercial': ['Contadores', 'Credelec', 'Documentos', 'Equipamento'],
  };

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchArtefato = async () => {
        try {
           const data = await api.getArtefato(Number(id));
          setFormData({
            nome: data.titulo || data.nome || '',
            categoria: data.categoria || '',
            area_negocio: data.area_negocio || '',
            data_aquisicao: data.data_aquisicao ? data.data_aquisicao.substring(0, 10) : '',
            origem: data.origem || '',
            localizacao: data.localizacao || '',
            estado_conservacao: data.estado_conservacao || '',
            material: data.material || '',
            dimensoes: data.dimensoes || '',
            responsavel: data.responsavel || '',
            descricao: data.descricao || '',
            foto: data.foto || '',
            galeria: data.galeria && Array.isArray(data.galeria) ? data.galeria : (typeof data.galeria === 'string' ? JSON.parse(data.galeria) : []),
          });
        } catch (error) {
          console.error('Erro ao buscar artefato:', error);
          showToast('Não foi possível carregar os dados deste artefato.', 'error');
          navigate('/admin/dashboard/artifacts');
        } finally {
          setFetching(false);
        }
      };
      fetchArtefato();
    }
  }, [id, isEditing]); // Removed navigate and showToast to prevent infinite loops if they are not stable

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, foto: url }));
  };

  const handleGalleryChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, galeria: images }));
  };

  const handleSubmit = async () => {
    if (!formData.nome) { // Changed from formData.titulo to formData.nome based on existing state structure
      showToast('O título é obrigatório.', 'warning');
      return;
    }

    setLoading(true);
    
    const payload = {
        ...formData,
        titulo: formData.nome,
        estado: formData.estado_conservacao,
        galeria: formData.galeria.filter(url => url.trim() !== '')
    };

    try {
      if (isEditing) {
        await api.updateArtefato(Number(id), payload);
        showToast('Artefato atualizado com sucesso!', 'success');
      } else {
        await api.createArtefato(payload);
        showToast('Artefato criado com sucesso!', 'success');
      }
      setTimeout(() => navigate('/admin/dashboard/artifacts'), 2000);
    } catch (error: any) {
      console.error('Erro ao salvar artefato:', error);
      showToast(error.message || 'Ocorreu um erro ao salvar o artefato.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <ToastComponent />
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/dashboard/artifacts')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Editar artefato' : 'Publicar artefato'}</h1>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1) Image / Gallery Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">
          <div className="max-w-xl">
             <ImageUploadField 
               label="Foto Principal"
               value={formData.foto}
               onChange={handleImageChange}
               required
             />
          </div>
        </section>

        {/* 2) Main Fields */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input type="text" id="nome" value={formData.nome} onChange={handleChange} placeholder="Nome do artefato" className="block w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm" />
          </div>

          <div>
            <label htmlFor="area_negocio" className="block text-sm font-medium text-gray-700 mb-2">Área de Negócio *</label>
            <select id="area_negocio" value={formData.area_negocio} onChange={(e) => { handleChange(e); setFormData(prev => ({ ...prev, area_negocio: e.target.value, categoria: '' })); }} className="block w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm">
              <option value="">Selecione a área...</option>
              <option value="Geração">Geração</option>
              <option value="Transporte">Transporte</option>
              <option value="Distribuição">Distribuição</option>
              <option value="Comercial">Comercialização</option>
            </select>
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select id="categoria" value={formData.categoria} onChange={handleChange} className="block w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm">
              <option value="">Selecione a categoria...</option>
              {(categoriasByArea[formData.area_negocio] || ['Equipamento', 'Instrumento', 'Documento', 'Fotografia']).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="data_aquisicao" className="block text-sm font-medium text-gray-700 mb-2">Data de aquisição</label>
              <input type="date" id="data_aquisicao" value={formData.data_aquisicao} onChange={handleChange} className="block w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm" />
            </div>
            <div>
              <label htmlFor="origem" className="block text-sm font-medium text-gray-700 mb-2">Origem</label>
              <input type="text" id="origem" value={formData.origem} onChange={handleChange} placeholder="Ex: Doação, Compra..." className="block w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
              <input type="text" id="localizacao" value={formData.localizacao} onChange={handleChange} placeholder="Ex: Sala 1, Armazém..." className="block w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm" />
            </div>
            <div>
              <label htmlFor="estado_conservacao" className="block text-sm font-medium text-gray-700 mb-2">Estado de conservação</label>
              <select id="estado_conservacao" value={formData.estado_conservacao} onChange={handleChange} className="block w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm">
                <option value="">Selecione...</option>
                <option value="Excelente">Excelente</option>
                <option value="Bom">Bom</option>
                <option value="Regular">Regular</option>
                <option value="Necessita Restauro">Necessita Restauro</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-2">Material</label>
            <input type="text" id="material" value={formData.material} onChange={handleChange} placeholder="Ex: Madeira, Ferro, Vidro..." className="block w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm" />
          </div>

          <div>
            <label htmlFor="dimensoes" className="block text-sm font-medium text-gray-700 mb-2">Dimensões</label>
            <textarea id="dimensoes" value={formData.dimensoes} onChange={handleChange} rows={2} placeholder="Escreva as dimensões do artefato" className="block w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm" />
          </div>

          <div>
            <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
            <input type="text" id="responsavel" value={formData.responsavel} onChange={handleChange} placeholder="Nome do responsável" className="block w-full px-4 py-2 border-[0.5px] border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm" />
          </div>
        </section>

        {/* 3) Description Editor */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">Descrição do artefato</label>
          <div className="border-[0.5px] border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-3 py-2 border-b-[0.5px] border-gray-300 flex gap-2">
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Bold className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Italic className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Type className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><AlignLeft className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><List className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><LinkIcon className="w-4 h-4" /></button>
            </div>
            <textarea id="descricao" value={formData.descricao} onChange={handleChange} rows={8} className="w-full p-4 focus:outline-none resize-y min-h-[200px]" placeholder="Descreva detalhadamente o artefato..."></textarea>
          </div>
        </section>

        {/* 4) Dynamic Gallery */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <DynamicGalleryField 
             images={formData.galeria}
             onChange={handleGalleryChange}
          />
        </section>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard/artifacts')}
            className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'Salvar Alterações' : 'Criar Artefato'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ArtifactForm;
