import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface Comment {
    id: number;
    author_name: string;
    content: string;
    created_at: string;
}

interface CommentSectionProps {
    type: string;
    id: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ type, id }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await api.getComments(type, id);
                setComments(data);
            } catch (err) {
                console.error("Não foi possível carregar comentários", err);
            }
        };
        fetchComments();
    }, [type, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!name.trim() || !content.trim()) {
            setError('Por favor preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            await api.createComment(type, id, { author_name: name, content });
            setSuccessMessage('Obrigado(a)! O seu comentário foi registado e aguarda aprovação.');
            setName('');
            setContent('');
        } catch (err: any) {
            setError(err.message || 'Erro ao submeter comentário. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mt-12 mb-12 shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <MessageSquare className="text-brand-orange w-6 h-6" />
                Deixe a sua opinião
            </h3>

            {successMessage ? (
                <div className="bg-green-50 text-green-700 p-6 rounded-xl flex items-center gap-4 mb-8">
                    <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                    <p className="font-medium text-lg">{successMessage}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="mb-10 space-y-4">
                    {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            O seu Nome
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange outline-none transition-shadow"
                            placeholder="Ex: João Silva"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Comentário
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange outline-none transition-shadow resize-y"
                            placeholder="O que achou deste conteúdo?"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gray-900 hover:bg-brand-orange text-white px-8 py-3 rounded-full font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'A enviar...' : 'Submeter Opinião'}
                        {!loading && <Send className="w-4 h-4" />}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        * Todos os comentários passam por moderação antes de serem publicados.
                    </p>
                </form>
            )}

            {comments.length > 0 && (
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">Comentários Publicados ({comments.length})</h4>
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-brand-orange font-bold text-lg flex-shrink-0">
                                    {comment.author_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-3 mb-1">
                                        <h5 className="font-bold text-gray-900">{comment.author_name}</h5>
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.created_at).toLocaleDateString('pt-MZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
