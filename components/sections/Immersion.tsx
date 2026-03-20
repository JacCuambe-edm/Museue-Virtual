import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/apiClient';

const Immersion: React.FC = () => {
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Fetch articles and pick the first one as featured here, or one with a specific category
        const data = await api.getArticles({ limit: 5 });
        if (data && data.length > 0) {
          // Let's use the 3rd or random article so it's not always the exact same as FeaturedStories slot 1
          const selected = data.length > 2 ? data[2] : data[0];
          setArticle(selected);
        }
      } catch (err) {
        console.error('Failed to fetch immersion article', err);
      }
    };
    fetchArticle();
  }, []);

  if (!article) return null;

  const rawImage = article.image_list || article.image3 || article.image1;
  const bgImage = rawImage 
    ? (rawImage.startsWith('//') ? `https:${rawImage}` : rawImage)
    : 'https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=2000&auto=format&fit=crop';

  return (
    <section className="py-24 bg-surface-container-lowest font-body">
      <div className="max-w-7xl mx-auto px-8">
        <div className="relative rounded-[2rem] overflow-hidden bg-primary-container aspect-[21/9] flex items-center justify-center shadow-2xl">
          <img 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60" 
            alt={article.title} 
            src={bgImage}
          />
          <div className="relative z-10 text-center px-6">
            <h2 className="text-4xl md:text-5xl font-black font-headline text-on-primary mb-6 line-clamp-2">
              {article.title}
            </h2>
            <p className="text-on-primary/90 font-bold mb-8 max-w-2xl mx-auto line-clamp-2 text-lg">
              {article.short_description || (article.content ? article.content.substring(0, 150) + '...' : 'Explore este artigo fascinante no Museu da EDM.')}
            </p>
            <Link to={`/artigo/${article.id}`} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group mb-8 mx-auto">
              <span className="material-symbols-outlined text-4xl text-primary-container group-hover:text-on-surface">menu_book</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Immersion;