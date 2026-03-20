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
  Image as ImageIcon,
  Plus,
  X,
  Heading1,
  Heading2,
  Quote,
  Loader2,
  Save
} from 'lucide-react';
import { ImageUploadField } from '../../ui/ImageUploadField';
import { useToast } from '../../ui/Toast';

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'image-text';
  content: string;
  image?: string;
  imagePosition?: 'left' | 'right';
}

const StoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { showToast, ToastComponent } = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: '1', type: 'text', content: '' }
  ]);

  useEffect(() => {
    if (isEditing && id) {
      loadArticle(parseInt(id));
    }
  }, [id, isEditing]);

  const loadArticle = async (articleId: number) => {
    try {
      setLoading(true);
      const data = await api.getArticle(articleId);
      setTitle(data.title || '');
      setSubtitle(data.subtitle || '');
      setCategory(data.category || '');
      setAuthor(data.author || '');
      
      // Assume coverImage usually mapped to image
      setCoverImage(data.image3 || null);
      
      if (data.body_text) {
        setBlocks([{ id: '1', type: 'text', content: data.body_text }]);
      }
    } catch (error) {
      console.error('Failed to load article', error);
      showToast('Erro ao carregar o artigo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addBlock = (type: 'text' | 'image' | 'image-text') => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      imagePosition: 'left'
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== id));
    }
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const generateMarkdownFromBlocks = (blocksToGen: ContentBlock[]) => {
    return blocksToGen.map(block => {
      if (block.type === 'text') return block.content;
      if (block.type === 'image') return `![Imagem do artigo](${block.image || ''})`;
      if (block.type === 'image-text') {
        const imgMarkdown = `![Imagem do artigo](${block.image || ''})`;
        return block.imagePosition === 'right' 
          ? `${block.content}\n\n${imgMarkdown}`
          : `${imgMarkdown}\n\n${block.content}`;
      }
      return '';
    }).join('\n\n');
  };

  const handleSave = async (isDraft = false) => {
    if (!title) {
        showToast('O título é obrigatório.', 'warning');
        return;
    }

    try {
        setSaving(true);
        let bodyText = generateMarkdownFromBlocks(blocks);

        const payload = {
            title,
            short_description: subtitle,
            category,
            author_email: author,
            image3: coverImage || '',
            body_text: bodyText,
            body_text2: '',
            body_text3: ''
        };

        if (isEditing && id) {
            await api.updateArticle(parseInt(id), payload);
        } else {
            await api.createArticle(payload);
        }
        
        showToast(isEditing ? 'História atualizada com sucesso!' : 'História publicada com sucesso!', 'success');
        setTimeout(() => navigate('/admin/dashboard/stories'), 2000);
    } catch (err: any) {
        console.error('Save failed', err);
        showToast('Erro ao guardar a história: ' + (err.message || String(err)), 'error');
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <ToastComponent />
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/dashboard/stories')}
          className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Editar História' : 'Criar História'}</h1>
          <p className="text-sm text-gray-500">{isEditing ? 'Atualize os detalhes do artigo' : 'Crie um artigo estilo blog com blocos flexíveis'}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
      <div className="space-y-6">
        {/* Cover Image */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <ImageUploadField
             label="Imagem de Capa"
             value={coverImage || ''}
             onChange={setCoverImage}
             placeholder="Carregar imagem de capa para a história"
          />
        </div>

        {/* Title & Meta */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da história..."
              className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0"
            />
          </div>
          
          <div>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtítulo ou descrição breve..."
              className="w-full text-lg text-gray-600 placeholder-gray-300 border-none focus:outline-none focus:ring-0 p-0"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="">Selecione uma categoria</option>
                <optgroup label="História">
                  <option value="Geração">Geração</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Distribuição">Distribuição</option>
                  <option value="Comercialização">Comercialização</option>
                </optgroup>
                <optgroup label="Outros">
                  <option value="Exposição">Exposição</option>
                  <option value="Evento">Evento</option>
                  <option value="Geral">Geral</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nome do autor"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
          {/* Note: In a full implementation, you'd want to add an implementation for saving the article data here */}
        </div>



        {/* Content Blocks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Conteúdo</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => addBlock('text')}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
              >
                <Type className="w-4 h-4" />
                Texto
              </button>
              <button 
                onClick={() => addBlock('image')}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                Imagem
              </button>
              <button 
                onClick={() => addBlock('image-text')}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Imagem + Texto
              </button>
            </div>
          </div>

          {blocks.map((block, index) => (
            <div key={block.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group">
              {/* Block Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">
                  Bloco {index + 1} • {block.type === 'text' ? 'Texto' : block.type === 'image' ? 'Imagem' : 'Imagem + Texto'}
                </span>
                <button 
                  onClick={() => removeBlock(block.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Block Content */}
              <div className="p-4">
                {block.type === 'text' && (
                  <div>
                    {/* Toolbar */}
                    <div className="flex gap-1 mb-3 pb-3 border-b border-gray-100">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Bold className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Italic className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Heading1 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Heading2 className="w-4 h-4" /></button>
                      <span className="w-px h-6 bg-gray-200 mx-1"></span>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><AlignLeft className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><List className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Quote className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><LinkIcon className="w-4 h-4" /></button>
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder="Escreva o conteúdo aqui..."
                      className="w-full min-h-[150px] text-gray-700 placeholder-gray-400 border-none focus:outline-none focus:ring-0 resize-y"
                    />
                  </div>
                )}

                {block.type === 'image' && (
                  <ImageUploadField
                     label="Imagem do Bloco"
                     value={block.image || ''}
                     onChange={(val) => updateBlock(block.id, { image: val })}
                     placeholder="Adicionar imagem"
                  />
                )}

                {block.type === 'image-text' && (
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${block.imagePosition === 'right' ? 'md:flex-row-reverse' : ''}`}>
                    {/* Image Side */}
                    <div className={`order-1 ${block.imagePosition === 'right' ? 'md:order-2' : 'md:order-1'}`}>
                       <ImageUploadField
                          label="Imagem do Bloco"
                          value={block.image || ''}
                          onChange={(val) => updateBlock(block.id, { image: val })}
                          placeholder="Adicionar imagem"
                       />
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => updateBlock(block.id, { imagePosition: 'left' })}
                          className={`flex-1 py-2 text-sm rounded-lg transition-colors ${block.imagePosition === 'left' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          Imagem à Esquerda
                        </button>
                        <button 
                          onClick={() => updateBlock(block.id, { imagePosition: 'right' })}
                          className={`flex-1 py-2 text-sm rounded-lg transition-colors ${block.imagePosition === 'right' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          Imagem à Direita
                        </button>
                      </div>
                    </div>
                    
                    {/* Text Side */}
                    <div className={`order-2 ${block.imagePosition === 'right' ? 'md:order-1' : 'md:order-2'}`}>
                      <textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="Escreva o texto que acompanha a imagem..."
                        className="w-full h-full min-h-[200px] p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions - Standardized Bottom Layout */}
        <div className="flex items-center justify-end gap-3 pt-4 mt-8 border-t border-gray-200">
          <button 
            type="button"
            onClick={() => navigate('/admin/dashboard/stories')}
            className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Guardar Rascunho
            </button>
            <button 
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'A guardar...' : 'Publicar História'}
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default StoryForm;
