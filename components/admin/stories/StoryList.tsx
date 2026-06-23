import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, Calendar, User, ArrowUpRight, Grid, List, Loader2 } from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useToast } from '../../ui/Toast';

interface Story {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  status: 'Published' | 'Draft';
  image: string;
  excerpt: string;
}

const StoryList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await api.getArticles();
      setStories(data);
    } catch (error) {
      console.error('Failed to load stories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja apagar esta história?')) {
      try {
        await api.deleteArticle(id);
        setStories(stories.filter(story => story.id !== id));
        showToast('História eliminada com sucesso!', 'success');
      } catch (error) {
        showToast('Erro ao apagar história.', 'error');
      }
    }
  };

  const getImageUrl = (image: string) => {
    if (!image) return "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400";
    return image.startsWith('//') ? `https:${image}` : image;
  };

  const filteredStories = stories.filter(story => 
    story.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    story.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <ToastComponent />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórias</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie artigos e histórias do museu</p>
        </div>
        <Link 
          to="/admin/dashboard/stories/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
        >
          <Plus className="h-4 w-4" />
          Nova História
        </Link>
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              placeholder="Pesquisar histórias..."
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center p-12 text-gray-500">Nenhum artigo encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div key={story.id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={getImageUrl(story.image_list || story.image3)} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700`}>
                      Publicado
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-sm text-orange-600 font-medium">{story.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">{story.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">{story.subtitle || story.short_description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium text-gray-700 line-clamp-1 max-w-[120px]" title={story.author || story.author_email}>{story.author || story.author_email || 'Admin'}</span>
                        <span className="mx-1">•</span>
                        {new Date(story.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5" title="Visualizações">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{story.views || 0}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Link to={`/artigo/${story.id}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link to={`/admin/dashboard/stories/edit/${story.id}`} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(story.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* List View */}
      {viewMode === 'list' && (
        loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center p-12 text-gray-500">Nenhum artigo encontrado.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredStories.map((story) => (
                <div key={story.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <img src={getImageUrl(story.image_list || story.image3)} alt={story.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-orange-600 font-medium">{story.category}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700`}>
                        Publicado
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mt-1 truncate">{story.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                      <span>{story.author || story.author_email || 'Admin'} • {new Date(story.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 text-gray-500" title="Visualizações">
                        <Eye className="w-3.5 h-3.5" /> {story.views || 0}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/artigo/${story.id}`} target="_blank" className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link to={`/admin/dashboard/stories/edit/${story.id}`} className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors">
                      <Edit2 className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(story.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
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

export default StoryList;
