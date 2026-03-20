import React from 'react';

const Comercial: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Interesting Visual Design */}
      <section className="relative min-h-[50vh] flex items-end justify-center">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-brand-orange to-amber-500"></div>
        

        
        {/* Wave Pattern at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
          </svg>
        </div>
        
        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        
        {/* Content Box - Overlapping into section below */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 translate-y-1/4 md:translate-y-1/2">
          <div className="bg-white rounded-lg shadow-2xl p-8 md:p-10">
            <div className="border-l-4 border-brand-orange pl-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comercial
              </h1>
              <p className="text-gray-600 leading-relaxed text-left md:text-justify">
                A função Comercial tem como principal missão desenvolver todo esforço comercial de atracção, manutenção e desenvolvimento da base de clientes, garantindo a excelência no atendimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pt-24 md:pt-40 pb-16 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-6 text-gray-700 text-sm md:text-base leading-relaxed text-left md:text-justify">
            <p>
              Tem como principal missão desenvolver todo esforço comercial de atracção, manutenção e desenvolvimento da base de clientes, por via da comunicação e divulgação, e disponibilização dos produtos e serviços da empresa aos segmentos de clientes de Alta, Média e Baixa Tensão, enquadrados em diversas categorias tarifárias.
            </p>

            <p>
              A função comercial é coordenada centralmente pela Direcção Comercial, cuja missão é executar a visão estratégica da empresa e promover a adopção de políticas comerciais, normas e processos que garantam o alcance de resultados com máxima eficácia e eficiência. Para tal, conta com dois Departamentos dedicadas à gestão dos segmentos de clientes de Grande e Baixo Consumo e integra um Departamento de Marketing e Vendas, através dos quais assegura a implementação e melhoria contínua das políticas e dos processos comerciais.
            </p>

            <p>
              Sendo que a função comercial da EDM é de cobertura nacional, foi necessário atribuir às Delegações, as competências operacionais de contratação de novos clientes, a gestão da base de clientes, no que respeita ao ciclo de facturação, gestão de dívida e serviços de suporte técnico-comerciais.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Comercial;
