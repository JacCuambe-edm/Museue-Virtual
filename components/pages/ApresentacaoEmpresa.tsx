import React from 'react';
import { Wifi, Eye, Award } from 'lucide-react';

const ApresentacaoEmpresa: React.FC = () => {
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
                Apresentação da Empresa
              </h1>
              <p className="text-gray-600 leading-relaxed text-left md:text-justify">
                Conheça a história e a missão da Electricidade de Moçambique (EDM), empresa responsável por iluminar e potenciar o desenvolvimento do país desde 1977.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pt-24 md:pt-40 pb-16 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-6 text-gray-700 text-sm md:text-base leading-relaxed text-justify">
            <p>
              A Electricidade de Moçambique, Empresa Estatal, (EDM-E.E.) foi criada em 27 de Agosto de 1977, através do Decreto Lei nº 38/77 de 27 de Agosto, que resultou da integração de vários Serviços Municipais de Água e Electricidade (SMAE), Sociedade Hidroeléctrica do Revuè (SHER), Sociedade Nacional de Estudos e Financiamentos de Empreendimentos Ultramarinos (SONEFE), Serviços Municipalizados de Electricidade (SME) e Serviços de Água e Electricidade (SAE).
            </p>

            <p>
              Em 1995 a EDM foi transformada numa empresa pública, ao abrigo do decreto nº 28/95, com a designação Electricidade de Moçambique, Empresa Pública (EDM – E.P.).
            </p>

            <p>
              O sector de energia é considerado prioritário a nível do Governo, que está empenhado em levar a cabo medidas para atrair o investimento privado nesta área e promover o desenvolvimento da rede nacional de energia.
            </p>

            <p>
              Em Outubro de 1997, acompanhando as tendências internacionais que apontavam para uma maior liberalização dos mercados, é promulgada a Lei de Electricidade (Lei 21/97 de 1 de Outubro) que altera alguns princípios presentes no quadro nacional e aprova a regulamentação específica que estabelece a Política Energética (resolução 05/98 de 3 de Março), que confere à EDM o papel de Gestor da Rede Nacional de Transporte de Energia Eléctrica e o Regulamento da Lei de Electricidade que define as competências e os procedimentos relativos à atribuição de concessões de Produção, Transporte, Distribuição e Comercialização de Energia Eléctrica.
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Objecto do Negócio da EDM</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li className="text-justify">
                  Estabelecimento e exploração dos meios de produção próprios e dos que fazem parte do património do Estado, colocados à disposição da EDM, afectos à produção de energia eléctrica;
                </li>
                <li className="text-justify">
                  Transformação, conversão, transporte, distribuição e comercialização de energia eléctrica no território nacional e fora dele;
                </li>
                <li className="text-justify">
                  Gestão e operação da rede nacional de transporte de energia eléctrica, na qualidade de Gestor da Rede Nacional de Transporte (RNT); e
                </li>
                <li className="text-justify">
                  Realização de trabalhos de instalação, de reparação e de renovação de bens afectos a exploração do serviço público.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre a EDM Section */}
      <section className="py-16 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Sobre a EDM
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Missão */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mb-4">
                <Wifi size={32} className="text-brand-orange" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Missão</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Produzir, transportar, distribuir e comercializar energia eléctrica de boa qualidade, de forma sustentável, para iluminar e potenciar a industrialização do país.
              </p>
            </div>

            {/* Visão */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mb-4">
                <Eye size={32} className="text-brand-orange" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Visão</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ser uma empresa de referência no setor energético, reconhecida pela qualidade dos serviços prestados e pelo compromisso com a sustentabilidade.
              </p>
            </div>

            {/* Valores */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mb-4">
                <Award size={32} className="text-brand-orange" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Valores</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Integridade, Transparência, Igualdade, Competitividade e Espírito de Equipa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApresentacaoEmpresa;
