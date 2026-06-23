import React from 'react';

interface Presidente {
  name: string;
  role: string;
  period: string;
  image: string;
  description?: string;
}

const GaleriaPresidentes: React.FC = () => {
  const presidentes: Presidente[] = [
    {
      name: 'Joaquim Henriques',
      role: 'Presidente',
      period: '1977 - 1983',
      image: '/images/historia/Joaquim.avif',
      description: 'Primeiro presidente da EDM após a sua criação em 1977, liderou a empresa durante os primeiros anos de consolidação.'
    },
    {
      name: 'Marcelino Gildo Alberto',
      role: 'Presidente',
      period: '1983 - 1990',
      image: '/images/historia/ENG. MARCELINO GILDO ALBERTO_compressed_page-0001.avif',
      description: 'Conduziu a empresa durante um período de expansão e modernização do sector eléctrico.'
    },
    {
      name: 'Aly Impija',
      role: 'Presidente',
      period: '1990 - 1994',
      image: '/images/historia/Aly Impija.avif',
      description: 'Liderou a EDM durante a transição para economia de mercado e reformas estruturais.'
    },
    {
      name: 'Mateus Magala',
      role: 'Presidente',
      period: '1994 - 2000',
      image: '/images/historia/Mateus Magala (1) (1).avif',
      description: 'Implementou importantes projectos de electrificação rural e expansão da rede.'
    },
    {
      name: 'Gildo Áério Sibumbe',
      role: 'Presidente',
      period: '2000 - 2005',
      image: '/images/historia/Gildo Sibumbe (1).avif',
      description: 'Promoveu a modernização tecnológica e melhoria da qualidade de serviço.'
    },
    {
      name: 'Augusto de Sousa Fernando',
      role: 'Presidente',
      period: '2005 - 2010',
      image: '/images/historia/Augusto de Sousa (1).avif',
      description: 'Liderou grandes projectos de infra-estrutura e parcerias internacionais.'
    },
    {
      name: 'Manuel João Cuambe',
      role: 'Presidente',
      period: '2010 - 2015',
      image: '/images/historia/Manuel Cuambe (1).avif',
      description: 'Conduziu a empresa durante período de crescimento económico e aumento da demanda.'
    },
    {
      name: 'Vicente Balisário Veloso',
      role: 'Presidente',
      period: '2015 - 2018',
      image: '/images/historia/Vicente Veloso (1).avif',
      description: 'Implementou reformas na gestão e programas de eficiência energética.'
    },
    {
      name: 'Fernando Ramos Julião',
      role: 'Presidente',
      period: '2018 - 2022',
      image: '/images/historia/Fernando Juliao (1).avif',
      description: 'Liderou iniciativas de transformação digital e energias renováveis.'
    },
    {
      name: 'Eng. Jorge Quincey Loaís',
      role: 'Presidente',
      period: '2022 - Presente',
      image: '/images/historia/67707aa6692778572357dab4_Jorge_Lousa.avif',
      description: 'Actual presidente da EDM, focado na universalização do acesso à energia e sustentabilidade.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
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
                Galeria dos Presidentes
              </h1>
              <p className="text-gray-600 leading-relaxed text-left md:text-justify">
                Conheça os líderes que guiaram a Electricidade de Moçambique ao longo da sua história, contribuindo para o desenvolvimento do sector eléctrico nacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Presidents Gallery */}
      <section className="pt-24 md:pt-40 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-8">
            {presidentes.map((presidente, index) => (
              <div 
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 p-6 rounded-2xl transition-all duration-300 hover:shadow-xl ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}
              >
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-56 md:w-56 md:h-64 rounded-xl overflow-hidden shadow-lg border-4 border-brand-orange/20">
                    <img 
                      src={presidente.image} 
                      alt={presidente.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.png'; }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 text-center ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {presidente.name}
                  </h2>
                  <p className="text-brand-orange font-semibold mb-1">
                    {presidente.role}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                    {presidente.period}
                  </div>
                  {presidente.description && (
                    <p className="text-gray-600 leading-relaxed max-w-lg mx-auto md:mx-0 text-left md:text-justify">
                      {presidente.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GaleriaPresidentes;
