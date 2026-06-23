import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  image: string;
  headline: string;
  sub: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: '/Hero02.jpg',
    headline: 'HISTÓRIA QUE CONSTRUIU MOÇAMBIQUE',
    sub: 'INFRAESTRUTURA • ENERGIA • DESENVOLVIMENTO',
    description: 'Desde as primeiras centrais hidroeléctricas às modernas subestações — 48 anos de electrificação ao serviço do povo moçambicano.',
  },
  {
    image: '/Hero01.png',
    headline: 'MUSEU VIRTUAL DA EDM',
    sub: 'EXPOSIÇÕES • ARTEFATOS • MEMÓRIA',
    description: 'Explore o percurso histórico da Electricidade de Moçambique através de exposições, artefactos e testemunhos que preservam a nossa memória colectiva.',
  },
];

const INTERVAL = 6000;

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 700);
  }, [animating]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: idx === 1 ? 'grayscale(20%) brightness(0.55)' : 'brightness(0.45)' }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pb-24 px-8 md:px-16 lg:px-24 pt-32">
        <div className="max-w-4xl">
          {/* Category tag */}
          <div
            key={`sub-${current}`}
            className="inline-flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <div className="w-8 h-px bg-brand-orange" />
            <span className="text-brand-orange text-xs font-bold tracking-[0.25em] uppercase">
              {slides[current].sub}
            </span>
          </div>

          {/* Headline */}
          <h1
            key={`headline-${current}`}
            className="font-headline font-black uppercase leading-none mb-6 text-white animate-in fade-in slide-in-from-bottom-6 duration-700"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 5.5rem)', letterSpacing: '-0.02em' }}
          >
            {slides[current].headline}
          </h1>

          {/* Description */}
          <p
            key={`desc-${current}`}
            className="text-white/75 text-base md:text-lg font-body leading-relaxed mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700"
          >
            {slides[current].description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <Link
              to="/timeline"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-base text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#fb8626' }}
            >
              Explorar
              <i className="fa-solid fa-arrow-right text-sm" />
            </Link>
            <Link
              to="/historia-geracao"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-base border-2 border-white/40 text-white transition-all hover:bg-white/10 hover:border-white"
            >
              Ver história
            </Link>
          </div>
        </div>

        {/* Bottom controls row */}
        <div className="mt-16 flex items-center justify-between">
          {/* Slide counter + dots */}
          <div className="flex items-center gap-6">
            <span className="text-white/40 text-xs font-bold tracking-widest font-body">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: idx === current ? '32px' : '8px',
                    height: '8px',
                    backgroundColor: idx === current ? '#fb8626' : 'rgba(255,255,255,0.3)',
                  }}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Arrows */}
          <div className="flex gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/50 transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/50 transition-all"
              aria-label="Próximo"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
        <div
          key={current}
          className="h-full bg-brand-orange origin-left"
          style={{ animation: `progress ${INTERVAL}ms linear forwards` }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
