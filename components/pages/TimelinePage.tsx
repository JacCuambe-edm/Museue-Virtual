import React from 'react';
import { 
  Zap, 
  Shield, 
  Scale, 
  FileText, 
  Building2, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Award,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface TimelineItem {
  year: string;
  title?: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const TimelinePage: React.FC = () => {
  const timelineData: TimelineItem[] = [
    {
      year: '1977',
      title: 'Fundação da EDM',
      category: 'Institucional',
      icon: <Building2 className="w-6 h-6" />,
      description: 'Através do decreto 38/77 de 27 de Agosto o governo converteu num só corpo administrativo as actividades desenvolvidas pelas empresas: Serviços Municipalizados de Água e Electricidade de Lourenço Marques (SMAE), SAE, e outros, criando a Electricidade de Moçambique - Empresa Estatal ("E.M.E. P.")',
    },
    {
      year: '1995',
      title: 'Transformação em Empresa Pública',
      category: 'Jurídico',
      icon: <Scale className="w-6 h-6" />,
      description: 'Através do Decreto nº 28/95, de 17 de Julho, a EDM transforma-se de Empresa Estatal para Empresa Pública, com plena autonomia administrativa, financeira, técnica e patrimonial.',
    },
    {
      year: '1997',
      title: 'Lei de Electricidade',
      category: 'Regulamentação',
      icon: <FileText className="w-6 h-6" />,
      description: 'Promulgação da Lei nº 21/97, abrindo o sector à iniciativa privada e estabelecendo as regras do Gestor da Rede Nacional de Transporte e a criação do Conselho Nacional de Electricidade (futura ARENE).',
    },
    {
      year: '1998',
      title: 'Política Energética',
      category: 'Estratégia',
      icon: <Target className="w-6 h-6" />,
      description: 'Aprovação da Resolução 05/98, definindo directrizes para o desenvolvimento sustentável do sector e implementação de projectos de reabilitação e expansão de infra-estruturas.',
    },
    {
      year: '2002',
      title: 'Estatuto da CONELEC',
      category: 'Regulamentação',
      icon: <Shield className="w-6 h-6" />,
      description: 'Aprovação do estatuto orgânico do Conselho Nacional de Electricidade (CONELEC) através do Decreto nº 38/2002.',
    },
    {
      year: '2003',
      title: 'Sistema Tarifário',
      category: 'Comercial',
      icon: <Zap className="w-6 h-6" />,
      description: 'Aprovação do sistema tarifário (Decreto nº 25/2003) para garantir sustentabilidade financeira, eficiência energética e acesso equitativo à electricidade.',
    },
    {
      year: '2005',
      title: 'Gestão da Rede Nacional',
      category: 'Operacional',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Designação da EDM como Gestor da Rede Nacional de Transporte de Energia Elétrica e do respectivo Centro de Despacho (Decretos 42/2005 e 43/2005).',
    },
    {
      year: '2010',
      title: 'Apoio ao Sector Agrícola',
      category: 'Social',
      icon: <Award className="w-6 h-6" />,
      description: 'Redução de 50% na tarifa de energia para consumidores agrícolas em média tensão, visando impulsionar a produção nacional de alimentos.',
    },
    {
      year: '2011',
      title: 'Parcerias Público-Privadas',
      category: 'Jurídico',
      icon: <Scale className="w-6 h-6" />,
      description: 'Lei nº 15/2011 estabelece o quadro legal para PPPs e Projectos de Grande Dimensão, atraindo investimento privado para o desenvolvimento económico.',
    },
    {
      year: '2012',
      title: 'Lei das Empresas Públicas',
      category: 'Governação',
      icon: <CheckCircle2 className="w-6 h-6" />,
      description: 'Lei nº 6/2012 reforça a eficiência, transparência e boa governação das empresas públicas em Moçambique.',
    },
    {
      year: '2017',
      title: 'Criação da ARENE',
      category: 'Regulamentação',
      icon: <Shield className="w-6 h-6" />,
      description: 'Criação da Autoridade Reguladora de Energia independente através da Lei nº 11/2017.',
    },
    {
      year: '2021',
      title: 'Consolidação Regulatória',
      category: 'Regulamentação',
      icon: <Calendar className="w-6 h-6" />,
      description: 'Criação da Autoridade Reguladora de Energia (ARE) através do Decreto nº 56/2021.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* --- Premium Hero Section --- */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-40">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-transparent to-amber-500/5 -z-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[100px] -z-10 translate-y-1/2 -translate-x-1/2"></div>
        
        {/* Abstract Patterns */}
        <div className="absolute inset-0 opacity-[0.03] -z-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#F7941D 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
              <Calendar size={14} />
              <span>Marcos Históricos</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Linha do <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">Tempo</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Uma jornada através das décadas, documentando a evolução da energia que ilumina Moçambique e impulsiona o nosso desenvolvimento.
            </p>
            
            {/* Scroll Indicator Icon */}
            <div className="flex justify-center">
              <div className="w-1 h-12 bg-gradient-to-b from-brand-orange to-transparent rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Timeline Section --- */}
      <section className="container mx-auto max-w-6xl px-4 pb-40 relative">
        {/* Central Line with Glow */}
        <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 -z-10">
          <div className="h-full w-full bg-gradient-to-b from-brand-orange via-amber-400 to-orange-600 opacity-20"></div>
          {/* Animated Glow Dot? No, keep it simple and clean */}
        </div>

        <div className="space-y-24 relative">
          {timelineData.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row items-center justify-between w-full group transition-all duration-700 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Year & Category Display (Desktop) */}
              <div className="hidden md:flex w-5/12 flex-col justify-center items-center">
                 <div className={`flex flex-col items-center ${index % 2 === 0 ? 'md:items-start' : 'md:items-end'}`}>
                    <span className="text-6xl font-black text-gray-200 group-hover:text-brand-orange/20 transition-colors duration-500 mb-2">
                       {item.year}
                    </span>
                    <span className="text-sm font-bold text-brand-orange/60 tracking-widest uppercase">
                       {item.category}
                    </span>
                 </div>
              </div>

              {/* Central Node */}
              <div className="absolute left-[30px] md:left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-brand-orange/30 rounded-full blur-md group-hover:scale-150 transition-transform duration-500"></div>
                
                {/* Node Body */}
                <div className="relative w-14 h-14 rounded-full bg-white border-4 border-brand-orange shadow-2xl flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                   {item.icon}
                </div>
              </div>

              {/* Content Card (Glassmorphism) */}
              <div className={`w-full md:w-5/12 pl-20 md:pl-0 mt-8 md:mt-0`}>
                <div className={`relative p-8 rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_30px_60px_-15px_rgba(247,148,29,0.15)] transition-all duration-500 border-l-[6px] border-l-brand-orange hover:-translate-y-2`}>
                  
                  {/* Decorative corner element */}
                  <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap size={40} className="text-brand-orange" />
                  </div>

                  <div className="mb-4 md:hidden flex justify-between items-center">
                     <span className="text-3xl font-black text-brand-orange/20">
                        {item.year}
                     </span>
                     <span className="text-[10px] font-bold text-brand-orange px-2 py-1 bg-brand-orange/10 rounded-md">
                        {item.category}
                     </span>
                  </div>

                  {item.title && (
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-orange transition-colors duration-300">
                      {item.title}
                    </h2>
                  )}

                  <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                    {item.description}
                  </p>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                     <button className="flex items-center gap-2 text-xs font-bold text-brand-orange hover:gap-3 transition-all">
                        DOCUMENTO OFICIAL <ChevronRight size={14} />
                     </button>
                     <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-brand-orange/20"></div>
                        <div className="w-1 h-1 rounded-full bg-brand-orange/40"></div>
                        <div className="w-1 h-1 rounded-full bg-brand-orange/60"></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer Decoration --- */}
      <section className="py-20 bg-gradient-to-t from-brand-orange/10 to-transparent">
        <div className="container mx-auto px-4 text-center">
           <div className="max-w-xl mx-auto p-12 rounded-[5rem] bg-brand-orange text-white shadow-2xl shadow-orange-200">
              <CheckCircle2 size={48} className="mx-auto mb-6 text-white/50" />
              <h3 className="text-3xl font-bold mb-4">Um Futuro Brilhante</h3>
              <p className="text-white/80 leading-relaxed">
                Cada marco nesta história é um passo firme para a EDM se tornar um fornecedor líder de energia na região da África Austral.
              </p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default TimelinePage;
