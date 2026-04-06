import React from 'react';

const LogoCloud: React.FC = () => {
  return (
    <section className="py-16 px-8 border-y border-outline-variant/20 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="text-xl font-black font-headline tracking-tighter text-on-surface/40">ELECTRICIDADE DE MOÇAMBIQUE</div>
        <div className="text-xl font-black font-headline tracking-tighter text-on-surface/40">MINISTÉRIO DA ENERGIA</div>
        <div className="text-xl font-black font-headline tracking-tighter text-on-surface/40">ARQUIVO NACIONAL</div>
        <div className="text-xl font-black font-headline tracking-tighter text-on-surface/40">PATRIMÓNIO CULTURAL</div>
      </div>
    </section>
  );
};

export default LogoCloud;