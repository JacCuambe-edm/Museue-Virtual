import React from 'react';

const About: React.FC = () => {
  return (
    <section id="sobre" className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 bg-primary-container/10 border border-primary-container/20 rounded-full">
              <span className="text-primary-container font-bold text-sm tracking-widest uppercase font-body">Sobre o Museu</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-tight text-on-surface">
              PRESERVANDO O PATRIMÓNIO ENERGÉTICO
            </h2>
            
            <p className="text-on-surface/70 text-lg leading-relaxed font-body">
              O Museu Virtual da EDM é uma iniciativa dedicada a catalogar, preservar e partilhar a rica história da eletrificação em Moçambique. Desde as primeiras turbinas até às modernas redes nacionais, cada artefato conta uma história de progresso e resiliência.
            </p>
            
            <div className="grid grid-cols-3 gap-8 pt-8 font-body">
              <div>
                <div className="text-4xl font-black text-primary-container font-headline">48+</div>
                <div className="text-sm text-on-surface/60 uppercase tracking-widest font-bold">Anos de História</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary-container font-headline">1000+</div>
                <div className="text-sm text-on-surface/60 uppercase tracking-widest font-bold">Artefatos</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary-container font-headline">11</div>
                <div className="text-sm text-on-surface/60 uppercase tracking-widest font-bold">Províncias</div>
              </div>
            </div>
          </div>
          
          <div className="relative group perspective-1000">
            <div className="absolute -inset-4 bg-primary-container rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-3xl p-12 shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-4 group-hover:shadow-[0_20px_50px_rgba(234,88,12,0.3)] flex items-center justify-center h-[500px]">
              <img 
                className="w-full h-full object-contain filter drop-shadow-md transition-all duration-500 group-hover:drop-shadow-xl" 
                alt="Logo Electricidade de Moçambique (EDM)" 
                src="/logo.png"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;