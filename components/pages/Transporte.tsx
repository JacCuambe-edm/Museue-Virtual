import React from 'react';

const Transporte: React.FC = () => {
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
                Transporte
              </h1>
              <p className="text-gray-600 leading-relaxed text-justify">
                A função de Transporte tem como missão dirigir, de forma eficiente e eficaz, as actividades de exploração e manutenção da Rede Nacional de Transporte de energia eléctrica.
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
                Tem como missão dirigir, de forma eficiente e eficaz, as actividades de exploração e manutenção da Rede Nacional de Transporte, que compreendem:
              </p>

              <div className="space-y-4 pl-4">
                <p>
                  a. Instalações de interligação para os produtores de electricidade e para a importação de electricidade;
                </p>

                <p>
                  b. Infra-estruturas de transporte de energia eléctrica, para fornecer energia para exportação, clientes de grande porte e redes de distribuição conectadas a Rede de Transporte;
                </p>

                <p>
                  c. Centro de Despacho; e
                </p>

                <p>
                  d. Infra-estruturas de telecomunicações, telemetria e controle remoto para a gestão eficaz e eficiente da Rede Nacional de Transporte de acordo com as disposições do código de Rede, acordos e regulamentos da SAPP (Southern African Power Pool).
                </p>
              </div>

              <p>
                A Rede Nacional de Transporte de Energia é constituída por dois subsistemas isolados, nomeadamente, Centro - Norte e Sul.
              </p>

              <p>
                A interconexão destes subsistemas é feita via países vizinhos, nomeadamente, Zimbabwe, através da rede de Transporte da ZESA e África do Sul, através da rede de Transporte da Eskom, esta última conecta-se à rede de Transporte Nacional (REN), através da rede da Motraco. Vide no mapa.
              </p>
            </div>

            {/* Right Column - Map Image */}
            <div className="flex justify-center items-start">
              <div className="border-4 border-brand-orange rounded-lg overflow-hidden shadow-lg w-full max-w-md">
                <img 
                  src="/images/mapa_transporte.avif" 
                  alt="Mapa da Rede de Transporte de Energia de Moçambique"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="py-12 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-6 text-gray-700 text-sm md:text-base leading-relaxed text-left md:text-justify">
            <p>
              Na Região Sul, das 37 subestações em funcionamento, 12 estão a operar no limite da sua capacidade, 6 linhas de transporte de energia a 66kV operam no seu limite de transferência e carecem de intervenção urgente para evitar a sobrecarga dos equipamentos, que se pode traduzir no seu envelhecimento precoce e/ou colapso.
            </p>

            <p>
              Com a implementação dos projectos de reforço da rede nomeadamente: PERIP, JICA, Hyousung, STPI e Emergência, o número de subestações sobrecarregadas a nível de Rede de Transporte Sul irá reduzir para 4, nomeadamente, Marracuene, Salamanga, SE10 e Kongolote.
            </p>

            <p>
              Na Região Centro, a Direcção de Transporte funciona com um total de 32 Subestações, das quais 27 pertencem à EDM, sendo que 3 são móveis, localizadas em Tete, Quelimane e Casa Nova. As restantes 24 são fixas, das quais 5 subestações são privadas (JINDAL, CIM Dondo, CIM Beira, Vale e ICVL).
            </p>

            <p>
              Actualmente, na região não há registo de subestações a operar no limite da sua capacidade. Não obstante tal facto, 2 linhas de transferência de potência, nomeadamente, DL3 (Matambo - Tete) e CL71 (Dondo - Munhava) estão a operar no seu limite térmico.
            </p>

            <p>
              No triénio 2019-2021, está planificada a ligação de cerca de 362.000 novos clientes, no âmbito da universalização do acesso, o que resultará na sobrecarga de 8 Subestação da rede de Transporte Centro.
            </p>

            <p>
              Se a implementação dos projectos de reforço da rede (PERIP, HYOUSUNG, STPI) for bem-sucedida, o quadro melhora, contudo, permanecerão críticas as subestações de Munhava, Chimolo 1 e Chimolo2.
            </p>

            <p>
              Na Região Norte, com o plano de universalização do acesso doméstico à rede, prevê-se para os próximos dois anos ligar cerca de 250 mil novos clientes, o que resultará no incremento da demanda e consequente sobrecarga de 7 Subestações.
            </p>

            <p>
              Mesmo com a implementação dos projectos em curso de reforço de rede nesta região (PERIP, HYOUSUNG, MARRUPA, STATCOM CUAMBA, LINHA CAIA-NACALA), irá prevalecer a necessidade de se proceder a um aumento da capacidade de transferência das linhas CL31 e CL32, para evitar restrições e garantir o fornecimento de energia eléctrica de qualidade da Cidade de Nampula e Nacala e aos distritos de Monapo, Ilha de Moçambique e Mussori, em caso da indisponibilidade da central flutuante (Karpower) e ou de uma das linhas (CL31 ou CL35).
            </p>

            <p>
              Para o quinquénio 2020 - 2024, estão previstos diversos projectos visando, por um lado, garantir a disponibilidade de potência para suprir a demanda e, por outro, garantir a segurança na exploração do sistema. Igualmente estão previstos projectos de melhoria dos processos de gestão dos activos da rede de transporte, modernização dos meios de diagnóstico de incidentes e consolidação dos procedimentos de O&M.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transporte;
