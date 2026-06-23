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

const AVATAR_COLORS = [
  'bg-orange-500', 'bg-amber-600', 'bg-orange-700', 'bg-yellow-600'
];

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

const LifeStories: React.FC = () => {
  const [testemunhos, setTestemunhos] = useState<Testemunho[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
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
    setImgFailed(false);
    setCurrentIndex((prev) => (prev + 1) % testemunhos.length);
  };

  const handlePrev = () => {
    setImgFailed(false);
    setCurrentIndex((prev) => (prev - 1 + testemunhos.length) % testemunhos.length);
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

  const imageUrl = current.image && !current.image.includes('logo.png')
    ? (current.image.startsWith('//') ? `https:${current.image}` : current.image)
    : null;

  const showAvatar = !imageUrl || imgFailed;
  const avatarColor = AVATAR_COLORS[currentIndex % AVATAR_COLORS.length];

  return (
    <section className="py-24 px-8 bg-surface-container-low font-body">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center gap-12">
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-on-surface mb-8">
            Histórias de Vida
          </h2>

          <div className="relative">
            <div className="absolute -inset-2 bg-primary-container rounded-full blur-lg opacity-10"></div>
            {showAvatar ? (
              <div
                key={current.id}
                className={`relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-in fade-in zoom-in-95 duration-500 ${avatarColor}`}
              >
                <span className="text-white text-4xl md:text-5xl font-black font-headline">
                  {getInitials(current.name)}
                </span>
              </div>
            ) : (
              <img
                key={current.image}
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-lg animate-in fade-in zoom-in-95 duration-500"
                alt={current.name}
                src={imageUrl!}
                onError={() => setImgFailed(true)}
              />
            )}
          </div>

          <div className="space-y-6">
            <span className="material-symbols-outlined text-primary-container text-6xl opacity-20" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            <blockquote className="text-2xl md:text-4xl font-headline font-bold leading-tight text-on-surface italic">
              "{current.message}"
            </blockquote>
            <div>
              <p className="text-xl font-black font-headline text-primary-container">{current.name}</p>
              {current.department && (
                <p className="text-on-surface/50 font-bold uppercase tracking-widest text-sm">{current.department}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={handlePrev} className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary-container hover:text-on-primary hover:border-primary-container transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex gap-2">
              {testemunhos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setImgFailed(false); setCurrentIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-primary-container w-6' : 'bg-outline-variant'}`}
                />
              ))}
            </div>
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
