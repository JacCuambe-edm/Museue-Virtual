import React, { useState, useEffect } from 'react';
import { Eye, Heart } from 'lucide-react';
import { api } from '../../services/apiClient';

interface PageMetricsProps {
    type: string;
    id: number;
}

const PageMetrics: React.FC<PageMetricsProps> = ({ type, id }) => {
    const [views, setViews] = useState(0);
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetricsAndRecordView = async () => {
            try {
                // Fetch current stats
                const data = await api.getMetrics(type, id);
                setViews(data.views);
                setLikes(data.likes);

                // Check local storage so we don't spam likes
                const likedEntities = JSON.parse(localStorage.getItem('likedEntities') || '{}');
                if (likedEntities[`${type}_${id}`]) {
                    setHasLiked(true);
                }

                // If this is the first time we load this page in this session, record a view
                const viewedEntities = JSON.parse(sessionStorage.getItem('viewedEntities') || '{}');
                if (!viewedEntities[`${type}_${id}`]) {
                    await api.recordView(type, id);
                    viewedEntities[`${type}_${id}`] = true;
                    sessionStorage.setItem('viewedEntities', JSON.stringify(viewedEntities));
                    // Optimistically increment view
                    setViews(prev => prev + 1);
                }
            } catch (error) {
                console.error('Error with metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id && type) {
            fetchMetricsAndRecordView();
        }
    }, [type, id]);

    const handleLike = async () => {
        if (hasLiked) return;
        
        try {
            await api.recordLike(type, id);
            setHasLiked(true);
            setLikes(prev => prev + 1);
            
            // Save in local storage
            const likedEntities = JSON.parse(localStorage.getItem('likedEntities') || '{}');
            likedEntities[`${type}_${id}`] = true;
            localStorage.setItem('likedEntities', JSON.stringify(likedEntities));
            
        } catch (error) {
            console.error('Error liking:', error);
        }
    };

    if (loading) return <div className="animate-pulse flex gap-4 h-6 w-32 bg-gray-100 rounded"></div>;

    return (
        <div className="flex items-center gap-6 text-gray-500 font-medium">
            <div className="flex items-center gap-2" title="Visualizações">
                <Eye className="w-5 h-5 text-gray-400" />
                <span>{views} visualizações</span>
            </div>
            
            <button 
                onClick={handleLike}
                disabled={hasLiked}
                className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300 ${
                    hasLiked 
                        ? 'bg-red-50 text-red-500 cursor-default' 
                        : 'hover:bg-red-50 hover:text-red-500 active:scale-95'
                }`}
            >
                <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current text-red-500' : ''}`} />
                <span>{likes} {likes === 1 ? 'gosto' : 'gostos'}</span>
            </button>
        </div>
    );
};

export default PageMetrics;
