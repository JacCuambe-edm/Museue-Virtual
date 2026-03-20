import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, XCircle, Trash2, Loader2, AlertCircle, Eye } from 'lucide-react';
import { api } from '../../../services/apiClient';

const CommentsList: React.FC = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadComments();
  }, [filter]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError('');
      let data = [];
      if (filter === 'pending') {
        data = await api.getPendingComments();
      } else {
        const allComments = await api.getAllComments();
        data = allComments.filter((c: any) => c.status === filter);
      }
      setComments(data);
    } catch (err: any) {
      setError('Erro ao carregar comentários');
    } finally {
      setLoading(false);
    }
  };

  const getEntityLink = (type: string, id: number) => {
    switch(type) {
      case 'article': return `/artigo/${id}`;
      case 'heritage': return `/patrimonio/${id}`;
      case 'exhibition': return `/exposicao/${id}`;
      case 'event': return `/evento/${id}`;
      case 'artifact': return `/artefato/${id}`;
      default: return '#';
    }
  };

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await api.updateCommentStatus(id, status);
      loadComments();
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este comentário?')) return;
    try {
      await api.deleteComment(id);
      loadComments();
    } catch (err) {
      alert('Erro ao excluir comentário');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-orange-500" />
          Moderação de Comentários
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${filter === 'pending' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${filter === 'approved' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Aprovados
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${filter === 'rejected' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Rejeitados
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum comentário {filter === 'pending' ? 'pendente' : filter === 'approved' ? 'aprovado' : 'rejeitado'}</h3>
          <p className="text-gray-500 mt-1">Tudo limpo por aqui.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {comments.map((comment) => (
              <li key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{comment.author_name}</span>
                      <span className="text-sm text-gray-500">em</span>
                      <a href={getEntityLink(comment.entity_type, comment.entity_id)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors px-2 py-0.5 rounded-full">
                        {comment.entity_type} {comment.entity_id}
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                      <span className="text-sm text-gray-400">• {new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap mt-2">{comment.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {filter === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(comment.id, 'approved')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Aprovar"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Rejeitar"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {filter === 'approved' && (
                      <button 
                        onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Rejeitar"
                      >
                         <XCircle className="w-5 h-5" />
                      </button>
                    )}
                    {filter === 'rejected' && (
                      <button 
                        onClick={() => handleUpdateStatus(comment.id, 'approved')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Aprovar"
                      >
                         <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
