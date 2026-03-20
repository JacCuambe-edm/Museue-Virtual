import React from 'react';

const Distribuicao: React.FC = () => {
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
                Distribuição
              </h1>
              <p className="text-gray-600 leading-relaxed text-left md:text-justify">
                A função de distribuição de energia eléctrica é coordenada centralmente pela Direcção de Distribuição, responsável por definir políticas e harmonizar os procedimentos de instalação, operação e manutenção dos activos do segmento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pt-24 md:pt-40 pb-16 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Text Content */}
            <div className="space-y-6 text-gray-700 text-sm md:text-base leading-relaxed text-left md:text-justify">
              <p>
                A função de distribuição de energia eléctrica é coordenada centralmente pela Direcção de Distribuição, cuja responsabilidade é definir políticas e harmonizar os procedimentos de instalação, operação, manutenção, automação e gestão de uma maneira uniforme dos activos do segmento Distribuição da EDM, que compreende os seguintes níveis de tensão: 0.23/0.4kV, 6.6kV, 11kV, 19.1kV (SWER), 22kV e 33kV.
              </p>

              <p>
                A infra-estrutura de distribuição é composta por Mini-subestações, linhas aéreas, linhas subterrâneas, postos de transformação, armários e quadros de distribuição.
              </p>

              <p>
                A Direcção de Distribuição tutela 5 Direcções Regionais, nomeadamente, Norte, Centro, Sul, Cidade de Maputo e Província de Maputo e 23 Delegações.
              </p>

              <p>
                O mapa ao lado apresenta as províncias e delegações sob jurisdição de cada Direcção Regional.
              </p>
            </div>

            {/* Right Column - Map Image */}
            <div className="flex justify-center items-start">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/images/provincias_delegacoes.avif" 
                  alt="Mapa das Províncias e Delegações de Moçambique"
                  className="w-full h-auto max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="py-12 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-6 text-gray-700 text-sm md:text-base leading-relaxed text-justify">
            <p>
              O facto de a maior parte da população moçambicana residir nas zonas rurais é evidenciado pelos rácios de densificação que constam da tabela acima.
            </p>

            <p>
              Com a excepção da Região da Cidade de Maputo, outras regiões têm uma média de 80 clientes por quilómetro de rede de distribuição em baixa tensão e menos de 1 (um) posto de transformação por quilómetro de rede de média tensão. Assim, para a universalização do acesso de energia à população, a EDM irá apostar, não só na expansão da rede para novos centros de consumos, mas também na densificação, que consiste em maximizar a exploração das infra-estruturas existentes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Distribuicao;
