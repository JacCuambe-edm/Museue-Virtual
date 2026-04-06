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
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-40" 
            alt="Wide angle view of a power station" 
            src="https://9c1d08050eb7db8d4704e1dad847a643.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1.5,fit=contain/f1706512652442x252334399599591900/div.framer-1htupq9.png"
          />
          <div className="relative z-10 text-center px-6">
            <h2 className="text-4xl md:text-6xl font-black font-headline text-on-primary mb-6">
              IMERSÃO 360º
            </h2>
            <p className="text-on-primary/80 font-bold mb-8 max-w-xl mx-auto">
              Visite virtualmente as nossas centrais e subestações sem sair de casa.
            </p>
            <button className="bg-on-primary text-primary-container w-20 h-20 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
              <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Immersion;