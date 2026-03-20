import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/apiClient';
import { Loader2 } from 'lucide-react';

const FeaturedStories: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await api.getArticles({ limit: 6 });
        if (data && data.length > 0) {
          const defaultImages = [
            'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1000&auto=format&fit=crop'
          ];
          
          const mapped = data.map((article: any, index: number) => {
            const rawImage = article.image_list || article.image3 || article.image1;
            const finalImage = rawImage ? (rawImage.startsWith('//') ? `https:${rawImage}` : rawImage) : defaultImages[index % defaultImages.length];

            return {
              id: article.id,
              title: article.title,
              short_description: article.short_description || (article.content ? article.content.substring(0, 100) + '...' : ''),
              category: article.category,
              image: finalImage,
              link: `/artigo/${article.id}`
            };
          });
          setStories(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch featured stories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-8 bg-surface-container-low flex justify-center items-center h-[500px]">
        <Loader2 className="w-10 h-10 text-primary-container animate-spin" />
      </section>
    );
  }

  if (stories.length === 0) {
     return null;
  }

  const mainStory = stories[0];
  const secondaryStory = stories[1];
  const smallStories = stories.slice(2);

  return (
    <section className="py-24 px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter mb-4 text-on-surface">HISTÓRIAS DE DESTAQUE</h2>
            <p className="text-on-surface/60 max-w-xl font-body">Explore os marcos fundamentais da rede elétrica moçambicana através das suas regiões mais emblemáticas.</p>
          </div>
          <Link to="/patrimonio-geracao" className="group flex items-center gap-2 text-primary-container font-bold uppercase tracking-widest text-sm font-body">
            Ver Arquivo Completo
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-auto font-body">
          {/* Main Card (Slot 1) */}
          {mainStory && (
            <div className="md:col-span-8 group relative overflow-hidden rounded-2xl bg-surface-container shadow-sm border border-outline-variant/10 min-h-[400px]">
              {mainStory.image && (
                <img 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-30" 
                  alt={mainStory.title}
                  src={mainStory.image}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
              <div className="absolute bottom-0 p-8 w-full z-10">
                {mainStory.category && (
                  <span className="text-primary-container font-bold text-xs uppercase tracking-[0.2em] mb-2 block">{mainStory.category}</span>
                )}
                <h3 className="text-3xl font-black font-headline mb-4 text-on-surface">{mainStory.title}</h3>
                {mainStory.short_description && (
                  <p className="text-on-surface/70 line-clamp-2 mb-6 max-w-lg">{mainStory.short_description}</p>
                )}
                <Link className="inline-flex items-center gap-2 text-on-surface font-bold text-sm border-b border-primary-container pb-1 hover:text-primary-container transition-colors" to={mainStory.link}>
                  Ler mais <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          )}

          {/* Secondary Card (Slot 2) */}
          {secondaryStory && (
            <div className={`group relative overflow-hidden rounded-2xl bg-surface-container shadow-sm border border-outline-variant/10 min-h-[400px] ${stories.length === 2 ? 'md:col-span-4' : 'md:col-span-4'}`}>
              {secondaryStory.image && (
                <img 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-30" 
                  alt={secondaryStory.title}
                  src={secondaryStory.image}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent"></div>
              <div className="absolute bottom-0 p-8 z-10">
                {secondaryStory.category && (
                  <span className="text-primary-container font-bold text-xs uppercase tracking-[0.2em] mb-2 block">{secondaryStory.category}</span>
                )}
                <h3 className="text-2xl font-black font-headline mb-4 text-on-surface">{secondaryStory.title}</h3>
                <Link className="inline-flex items-center gap-2 text-on-surface font-bold text-sm border-b border-primary-container pb-1 hover:text-primary-container transition-colors" to={secondaryStory.link}>
                  Ler mais <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          )}

          {/* Small Regional Cards (Slots 3-6) */}
          {smallStories.map((story, index) => {
            // Calculate span to fill bottom row nicely depending on remaining items
            let spanClass = "md:col-span-3";
            const remainingCount = smallStories.length;
            if (remainingCount === 1) spanClass = "md:col-span-12";
            else if (remainingCount === 2) spanClass = "md:col-span-6";
            else if (remainingCount === 3) spanClass = "md:col-span-4";
            
            return (
              <div key={story.id} className={`${spanClass} group relative overflow-hidden rounded-2xl bg-surface-container shadow-sm border border-outline-variant/10 min-h-[250px]`}>
                 {story.image && (
                    <img 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-20 mix-blend-multiply" 
                      alt={story.title}
                      src={story.image}
                    />
                 )}
                <div className="p-8 flex flex-col h-full justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-black font-headline mb-2 text-on-surface line-clamp-2">{story.title}</h3>
                    {story.short_description && (
                      <p className="text-sm text-on-surface/60 mb-6 font-body line-clamp-3">{story.short_description}</p>
                    )}
                  </div>
                  <Link className="text-primary-container font-bold text-xs uppercase tracking-widest mt-auto" to={story.link}>Explorar</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;