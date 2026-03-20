import React from 'react';

interface CentralData {
  nome: string;
  tipo: string;
  localizacao: string;
  capacidadeInstalada: number | string;
  capacidadeDisponivel: number | string;
}

const Geracao: React.FC = () => {
  const centraisData: CentralData[] = [
    { nome: 'Corumana', tipo: 'Hídrica', localizacao: 'Maputo', capacidadeInstalada: 16.3, capacidadeDisponivel: 16.0 },
    { nome: 'Chicamba', tipo: 'Hídrica', localizacao: 'Manica', capacidadeInstalada: 44.0, capacidadeDisponivel: 22.0 },
    { nome: 'Mavuzi', tipo: 'Hídrica', localizacao: 'Manica', capacidadeInstalada: 52.0, capacidadeDisponivel: 25.0 },
    { nome: 'Temane', tipo: 'Térmica- Gás', localizacao: 'Inhambane', capacidadeInstalada: 11.2, capacidadeDisponivel: 10.31 },
    { nome: 'GTG - Beira', tipo: 'Térmica- Diesel', localizacao: 'Sofala', capacidadeInstalada: 14.0, capacidadeDisponivel: 2.0 },
    { nome: 'Lichinga', tipo: 'Hídrica', localizacao: 'Niassa', capacidadeInstalada: 0.7, capacidadeDisponivel: 0.5 },
    { nome: 'Cuamba', tipo: 'Hídrica', localizacao: 'Niassa', capacidadeInstalada: 1.0, capacidadeDisponivel: 0.5 },
    { nome: 'CTM', tipo: 'Térmica- Gás', localizacao: 'Maputo', capacidadeInstalada: 106.0, capacidadeDisponivel: 106.0 },
  ];

  const totalInstalada = centraisData.reduce((sum, central) => sum + (typeof central.capacidadeInstalada === 'number' ? central.capacidadeInstalada : 0), 0);
  const totalDisponivel = centraisData.reduce((sum, central) => sum + (typeof central.capacidadeDisponivel === 'number' ? central.capacidadeDisponivel : 0), 0);

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
                Geração
              </h1>
              <p className="text-gray-600 leading-relaxed text-justify">
                A Função Geração tem como missão coordenar e implementar a gestão, exploração e manutenção dos meios de produção de energia eléctrica, garantindo a gestão sustentável da capacidade de produção em função da demanda.
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
              No presente quinquénio, no parque produtor, prevê-se a recuperação de cerca de 78MW de capacidade produtiva que se encontra indisponível por motivos de avarias de vária ordem. Desta capacidade, 22 MW serão recuperados na Central Hídrica de Chicamba, 15.8MW na Central Hídrica de Mavuzi, 40MW na Central Térmica a Gás Natural de Maputo (CTM).
            </p>

            <p>
              Esta recuperação da capacidade produtiva vai melhorar, em grande medida, os níveis de resposta à demanda nos diferentes subsistemas de transporte de energia ao longo do País.
            </p>

            <p>
              Para além desta recuperação, prevê-se o aumento da capacidade produtiva em cerca de 45MW, resultante da montagem da central de emergência de 40MW em Nacala, aumento da capacidade instalada em Temaninho em mais 3 MW e a ampliação da Mini-hídrica de Cuamba em mais 2.5MW.
            </p>

            <p>
              Importa referenciar que, pelo facto de a geração ter centrais a funcionar em regimes diferentes, nomeadamente (Pick, Base load e Med-merit), o valor global do factor de carga (GLF) e de utilização de energia (EUF), vai situar-se nos 52% e 53%, respectivamente de 2021 em diante.
            </p>

            <p>
              A geração da EDM está presente nas três regiões do País, nomeadamente Sul, Centro e Norte. Esta realidade impõe que sejam alocados recursos, não só humanos, mas também materiais e equipamentos para a gestão das centrais.
            </p>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="py-12 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-brand-orange text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">Nome de Central</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Tipo de Central</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Localização</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Capacidade Instalada (MW)</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Capacidade Disponível (MW)</th>
                </tr>
              </thead>
              <tbody>
                {centraisData.map((central, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2">{central.nome}</td>
                    <td className="border border-gray-300 px-4 py-2">{central.tipo}</td>
                    <td className="border border-gray-300 px-4 py-2">{central.localizacao}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{central.capacidadeInstalada}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{central.capacidadeDisponivel}</td>
                  </tr>
                ))}
                <tr className="bg-brand-orange/10 font-bold">
                  <td className="border border-gray-300 px-4 py-2" colSpan={3}>TOTAL</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{totalInstalada.toFixed(1)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{totalDisponivel.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6 italic">
            A tabela acima apresenta a capacidade de geração instalada e disponível por central.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Geracao;
