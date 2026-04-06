import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';

const About: React.FC = () => {
  const [stats, setStats] = useState({ artifacts: 0, provinces: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [artifactsRes, patrimoniosRes] = await Promise.all([
          apiClient.get('/artefatos'),
          apiClient.get('/patrimonios')
        ]);
        
        const artifactsCount = artifactsRes.data.length;
        const provinces = [...new Set(patrimoniosRes.data.map((p: any) => p.regiao).filter((r: any) => r))];
        
        setStats({ artifacts: artifactsCount, provinces: provinces.length });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <section id="sobre" className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 bg-primary-container/10 border border-primary-container/20 rounded-full">
              <span className="text-primary-container font-bold text-sm tracking-widest uppercase font-body">Sobre a História da EDM</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-tight text-on-surface">
              BEM-VINDO AO MUSEU VIRTUAL DA EDM
            </h2>
            
            <p className="text-on-surface/70 text-lg leading-relaxed font-body">
              No final do século XIX, a colonização portuguesa em Moçambique atingiu seu auge, com um grande fluxo populacional colonial. Para impulsionar a economia, foram estabelecidas negociações para a construção da linha férrea entre Transvaal e Lourenço Marques, facilitando o escoamento de produtos. Com o crescimento populacional e econômico, tornou-se essencial a produção de energia elétrica para o desenvolvimento da colônia. Porém, devido a limitações financeiras, o governo colonial concedeu esses serviços a empresas privadas.
            </p>
            
            <div className="grid grid-cols-3 gap-8 pt-8 font-body">
              <div>
                <div className="text-4xl font-black text-primary-container font-headline">48+</div>
                <div className="text-sm text-on-surface/60 uppercase tracking-widest font-bold">Anos de História</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary-container font-headline">{stats.artifacts}+</div>
                <div className="text-sm text-on-surface/60 uppercase tracking-widest font-bold">Artefatos</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary-container font-headline">{stats.provinces}</div>
                <div className="text-sm text-on-surface/60 uppercase tracking-widest font-bold">Províncias</div>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary-container/5 rounded-2xl group-hover:bg-primary-container/10 transition-all duration-500"></div>
            <img
              className="relative rounded-xl w-full h-[500px] object-cover shadow-xl grayscale hover:grayscale-0 transition-all duration-700"
              alt="Vintage industrial machinery"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5nocshYvLeAstpJgHHcy8an-x287VelRpV4V6JZMdgfRPRbF0-aA7JVH49Yy4dQ8CB-eZftSBMa-TayXuCTaB1eMacofMzPDRSoq_xfVD28MQRtyFIgAA-Emf3Yhd_Pi3zDnT1FU5-w3vosXwtu22Otu_TfT5MJIaVZeTzaUxkHQXnW0m4mVdDGPNytLED0dm_k0FXSL6eb9XfD5BmLQpz72UqdHKxugeby1mnsQpkwz4CZTQInHLkeus7toq6exjAxFRBFdf-xUH"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;