import React, { useState } from "react";
import { usePageMeta } from '../../hooks/usePageMeta';

interface TeamMember {
  name: string;
  role: string;
  image?: string;
}

const avatarColors = ['#fb8626', '#F16624', '#c2410c'];

const Avatar: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  const [imgError, setImgError] = useState(false);
  const initials = member.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('');

  if (member.image && !imgError) {
    return (
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center text-white text-3xl font-black font-headline"
      style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
    >
      {initials}
    </div>
  );
};

const SobreMuseu: React.FC = () => {
  usePageMeta({ title: 'Sobre o Museu', description: 'Conheça a equipa, a missão e a visão do Museu Virtual da Electricidade de Moçambique — EDM.', image: '/logo.png' });
  const teamMembers: TeamMember[] = [
    { name: "Dra Aissa Fumo", role: "Directora da Academia da EDM" },
    { name: "Jerónimo Nhussi", role: "Chefe do Departamento de Gestão de Conhecimento" },
    { name: "Fernando Machava", role: "Museólogo" },
  ];

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
                Museu Virtual da EDM
              </h1>
              <p className="text-gray-600 leading-relaxed text-left md:text-justify">
                Descubra a história da eletricidade em Moçambique através do nosso museu virtual. Uma iniciativa da EDM para preservar e divulgar o patrimônio do sector elétrico nacional.
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
              O Museu da Eletricidade de Moçambique é um Museu Industrial de
              iniciativa empresarial, que surge no seio da política da Empresa
              Electricidade de Moçambique (EDM) de preservação do patrimônio
              elétrico e de divulgação da evolução da própria empresa.
            </p>

            <p>
              Em Moçambique não existe uma rede de museus da indústria, da
              técnica, ou sequer um Museu Nacional vocacionado para esta área de
              desenvolvimento do país, apesar de no passado recente ter existido
              um patrimônio industrial e tecnológico importante, na posse de
              grandes companhias privadas e instituições do Estado, tais como os
              casos dos Caminhos de Ferro de Moçambique e dos Correios,
              Telégrafos e Telefones, entre outros. Os CAMINHOS DE FERRO DE
              MOÇAMBIQUE criaram o primeiro Museu Industrial em Moçambique,
              recolhendo parte dos equipamentos e máquinas existentes no país,
              como são o caso das duas locomotivas que se encontram no átrio da
              estação ferroviária de Maputo. Este Museu teve um longo período de
              gestação, iniciado ainda na década de 1970, tendo sido finalmente
              inaugurado em 11 de junho de 2015.
            </p>

            <p>
              Uma outra iniciativa foi igualmente desenhada pela empresa
              TELECOMUNICAÇÕES DE MOÇAMBIQUE, na década de 1990, chegando a ter
              uma infraestrutura destinada a acolher o patrimônio a expor. A
              empresa recolheu ainda algumas máquinas e equipamentos, procedido
              à sua limpeza e manutenção, usando antigos funcionários da
              empresa, já aposentados.
            </p>

            <p>
              Mais recentemente, o Instituto Nacional de Comunicações de
              Moçambique (INCM) iniciou o processo e instalação de um Museu das
              Comunicações, juntando diversas empresas públicas e privadas, como
              a Sociedade de Notícias (possuidora dos títulos dos periódicos
              Notícias, Domingo e Desafio), da Rádio Moçambique, da Televisão de
              Moçambique, das TMCEL e do INCM.
            </p>

            <p>
              O Museu da ELECTRICIDADE DE MOÇAMBIQUE ganha, assim, uma especial
              relevância, pela quase inexistência de outras infraestruturas
              museológicas destinadas a preservar o patrimônio industrial. O
              âmbito do Museu da ELECTRICIDADE DE MOÇAMBIQUE ultrapassa a
              história da empresa e o público interessado.
            </p>

            <p>
              Não abrange apenas os seus trabalhadores no activo e reformados e
              as suas famílias, como também estudantes de diversas instituições
              de ensino técnico do país a que se junta ainda um vasto público
              ávido de explorar aspectos ainda desconhecidos da história de
              Moçambique.
            </p>

            <p>
              O Museu da ELECTRICIDADE DE MOÇAMBIQUE pretende mostrar o percurso
              da empresa, participando na criação de uma identidade comum, ser
              usado como meio auxiliar do ensino das ciências e das técnicas nos
              níveis básico e secundário, na pós-graduação da história das
              ciências e técnicas e da museologia.
            </p>

            <p>
              Considerando que a instalação do Museu Permanente é um processo a
              médio ou longo prazo, a EDM decidiu, a curto prazo, desenvolver
              acções com vista a tornar o Museu conhecido, tanto ao nível da
              EDM, assim como pelo público em geral e, simultaneamente, fazer a
              sensibilização para as questões da salvaguarda e proteção do
              Patrimônio do Sector de Eletricidade.
            </p>

            <p>
              Uma dessas acções é a criação do presente Museu Virtual da EDM,
              que pretende partilhar a evolução tecnológica da EDM e a história
              da eletrificação de Moçambique, narrativas ou depoimentos de
              alguns trabalhadores envolvidos na operação de equipamentos e em
              projectos de eletrificação e documentos relevantes (fotos,
              documentos, notícias).
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Equipe Técnica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-orange-100 shadow-md">
                  <Avatar member={member} index={index} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 max-w-[200px]">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreMuseu;
