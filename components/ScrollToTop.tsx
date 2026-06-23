import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-xl animate-in fade-in zoom-in-75 duration-200"
      style={{ backgroundColor: '#fb8626' }}
      aria-label="Voltar ao topo"
    >
      <ChevronUp size={22} />
    </button>
  );
};

export default ScrollToTop;
