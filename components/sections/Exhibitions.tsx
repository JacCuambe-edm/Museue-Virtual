import React from 'react';
import { Link } from 'react-router-dom';

const Exhibitions: React.FC = () => {
  return (
    <section className="py-32 px-8 bg-surface-container-low text-center font-body">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface">
          ESPAÇO DE <br/> <span className="text-primary-container">EXPOSIÇÕES</span> ONLINE
        </h2>
        <p className="text-on-surface/60 text-xl leading-relaxed">
          Mergulhe em galerias temáticas que celebram a evolução técnica e social de Moçambique através dos olhos da EDM.
        </p>
        <div className="pt-8">
          <Link to="/exposicoes" className="inline-block bg-primary-container text-on-primary px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-lg">
            EXPLORAR AGORA
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Exhibitions;