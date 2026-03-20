import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../services/apiClient';

interface Testemunho {
  id: number;
  name: string;
  message: string;
  image: string;
  department: string;
}

const LifeStories: React.FC = () => {
  const [testemunhos, setTestemunhos] = useState<Testemunho[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestemunhos = async () => {
      try {
        const data = await api.getTestemunhos();
        if (data && data.length > 0) {
          setTestemunhos(data);
        }
      } catch (err) {
        console.error('Erro ao buscar testemunhos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestemunhos();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testemunhos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testemunhos.length) % testemunhos.length);
  };

  const getImageUrl = (image: string) => {
    if (!image) return "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop";
    return image.startsWith('//') ? `https:${image}` : image;
  };

  if (loading) {
    return (
      <section className="py-24 flex justify-center bg-surface-container-low">
        <Loader2 className="w-8 h-8 text-primary-container animate-spin" />
      </section>
    );
  }

  const current = testemunhos[currentIndex];

  if (!current) return null;

  return (
    <section className="py-24 px-8 bg-surface-container-low font-body">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center gap-12">
          <div className="relative">
            <div className="absolute -inset-2 bg-primary-container rounded-full blur-lg opacity-10"></div>
            <img 
               key={current.image}
               className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-lg animate-in fade-in zoom-in-95 duration-500" 
               alt={current.name} 
               src={getImageUrl(current.image)}
            />
          </div>
          
          <div className="space-y-6">
            <span className="material-symbols-outlined text-primary-container text-6xl opacity-20" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            <blockquote className="text-2xl md:text-4xl font-headline font-bold leading-tight text-on-surface italic">
              "{current.message}"
            </blockquote>
            <div>
              <p className="text-xl font-black font-headline text-primary-container">{current.name}</p>
              <p className="text-on-surface/50 font-bold uppercase tracking-widest text-sm">{current.department}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button onClick={handlePrev} className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary-container hover:text-on-primary hover:border-primary-container transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button onClick={handleNext} className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary-container hover:text-on-primary hover:border-primary-container transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifeStories;