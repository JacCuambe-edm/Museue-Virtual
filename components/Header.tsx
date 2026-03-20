import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { 
      name: 'Sobre', 
      href: '#sobre',
      subItems: [
        { label: 'Sobre o museu', routePath: '/sobre-museu' }, 
        { label: 'Apresentação da empresa', routePath: '/apresentacao-empresa' }, 
        { label: 'PLANO OPERACIONAL'}, 
        { label: '1. GERAÇÃO', routePath: '/geracao' }, 
        { label: '2. TRANSPORTE', routePath: '/transporte' }, 
        { label: '3. DISTRIBUIÇÃO', routePath: '/distribuicao' }, 
        { label: '4. COMERCIAL', routePath: '/comercial' }
      ]
    },
    { 
      name: 'História', 
      href: '#historia',
      subItems: [
        { label: 'Geração', routePath: '/historia-geracao' },
        { label: 'Transporte', routePath: '/historia-transporte' },
        { label: 'Distribuição', routePath: '/historia-distribuicao' },
        { label: 'Comercialização', routePath: '/historia-comercializacao' },
        { label: 'Galeria dos presidentes', routePath: '/galeria-presidentes' },
        { label: 'Galeria', routePath: '/galeria' },
        { label: 'Curiosidades', routePath: '/curiosidades' }
      ]
    },
    { 
      name: 'Patrimônio', 
      href: '#patrimonio',
      subItems: [
        { label: 'Geração', routePath: '/patrimonio-geracao' },
        { label: 'Transporte:', isHeader: true },
        { label: '• Transmissão Sul', routePath: '/transmissao-sul', indented: true },
        { label: '• Transmissão Centro', routePath: '/transmissao-centro', indented: true },
        { label: '• Transmissão Norte', routePath: '/transmissao-norte', indented: true },
        { label: 'Distribuição', routePath: '/patrimonio-distribuicao' },
        { label: 'Comercialização', routePath: '/patrimonio-comercial' }
      ]
    },
    { name: 'Exposições', href: '#exposicoes', routePath: '/exposicoes' },
    { 
      name: 'Artefatos', 
      href: '#artefatos',
      subItems: [
        { label: 'Geração', routePath: '/artefatos-geracao' },
        { label: 'Transporte', routePath: '/artefatos-transporte' },
        { label: 'Distribuição', routePath: '/artefatos-distribuicao' },
        { label: 'Comercialização', routePath: '/artefatos-comercial' }
      ]
    },
  ];

  const hasTransparentHero = [
    '/',
    '/sobre-museu', '/apresentacao-empresa', '/geracao', '/transporte', '/distribuicao', '/comercial',
    '/historia-geracao', '/historia-transporte', '/historia-distribuicao', '/historia-comercializacao',
    '/galeria-presidentes',
    '/patrimonio-geracao', '/patrimonio-transporte', '/patrimonio-distribuicao', '/patrimonio-comercial',
    '/transmissao-sul', '/transmissao-centro', '/transmissao-norte',
    '/exposicoes',
    '/artefatos-geracao', '/artefatos-transporte', '/artefatos-distribuicao', '/artefatos-comercial'
  ].includes(location.pathname);

  const shouldBeSolid = isScrolled || !hasTransparentHero;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldBeSolid ? 'bg-white shadow-md py-0' : 'bg-transparent py-6'
      }`}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className={`text-3xl font-bold tracking-tighter transition-colors ${shouldBeSolid ? 'text-brand-orange' : 'text-white'}`}>
            Museu
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 h-full">
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="relative h-full flex items-center group"
              onMouseEnter={() => link.subItems && setActiveDropdown(link.name)}
            >
              {link.routePath && !link.subItems ? (
                <Link
                  to={link.routePath}
                  className={`flex items-center text-sm font-medium hover:text-brand-orange transition-colors ${
                    shouldBeSolid ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  href={link.href}
                  className={`flex items-center text-sm font-medium hover:text-brand-orange transition-colors ${
                    shouldBeSolid ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {link.name}
                  {link.subItems && <ChevronDown size={14} className="ml-1 mt-0.5" />}
                </a>
              )}

              {/* Dropdown Menu */}
              {link.subItems && activeDropdown === link.name && (
                <div 
                  className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-lg border-t-2 border-brand-orange overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.subItems.map((item, idx) => {
                    const label = typeof item === 'string' ? item : item.label;
                    const indented = typeof item === 'object' && 'indented' in item && item.indented;
                    const routePath = typeof item === 'object' && 'routePath' in item ? item.routePath : null;
                    const isHeader = typeof item === 'object' && 'isHeader' in item && item.isHeader;

                    const className = `block py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-brand-orange border-b border-gray-50 last:border-0 transition-colors ${indented ? 'pl-10 pr-6' : 'px-6'}`;

                    // Non-clickable header item
                    if (isHeader) {
                      return (
                        <span
                          key={idx}
                          className="block py-3 text-sm text-gray-800 font-semibold px-6 border-b border-gray-50 cursor-default"
                        >
                          {label}
                        </span>
                      );
                    }

                    if (routePath) {
                      return (
                        <Link
                          key={idx}
                          to={routePath}
                          className={className}
                          onClick={() => setActiveDropdown(null)}
                        >
                          {label}
                        </Link>
                      );
                    }

                    return (
                      <a
                        key={idx}
                        href="#"
                        className={className}
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:block">
           <Link 
            to="/timeline" 
            className={`text-sm font-semibold px-8 py-3 rounded-full transition-colors shadow-lg ${
              shouldBeSolid 
                ? 'bg-brand-orange text-white hover:bg-orange-600' 
                : 'bg-white text-brand-orange hover:bg-gray-100'
            }`}
          >
            Linha de tempo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden transition-colors ${shouldBeSolid ? 'text-brand-orange' : 'text-white'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[80px] bottom-0 bg-white z-40 overflow-y-auto">
          <div className="flex flex-col p-6 space-y-6 pb-24">
           {navLinks.map((link) => (
            <div key={link.name} className="flex flex-col space-y-3">
              {link.routePath && !link.subItems ? (
                <Link 
                  to={link.routePath}
                  className="text-lg font-bold text-gray-800 flex justify-between items-center py-2 active:bg-gray-50 px-2 -mx-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  type="button" 
                  className="text-lg font-bold text-gray-800 flex justify-between items-center py-2 w-full text-left active:bg-gray-50 px-2 -mx-2 rounded-lg"
                  onClick={() => {
                     // Toggle submenu or just let it stay open? 
                     // The current design shows subitems always if present? No, let's keep it simple.
                  }}
                >
                  {link.name}
                  {link.subItems && <ChevronDown size={16} />}
                </button>
              )}
              {link.subItems && (
                <div className="pl-4 flex flex-col space-y-3 border-l-2 border-brand-orange/20 ml-2">
                  {link.subItems.map((sub, idx) => {
                    const label = typeof sub === 'string' ? sub : sub.label;
                    const indented = typeof sub === 'object' && 'indented' in sub && sub.indented;
                    const routePath = typeof sub === 'object' && 'routePath' in sub ? sub.routePath : null;
                    const isHeader = typeof sub === 'object' && 'isHeader' in sub && sub.isHeader;
                    
                    // Non-clickable header item
                    if (isHeader) {
                      return (
                        <span 
                          key={idx} 
                          className="text-gray-900 font-bold text-sm pt-2"
                        >
                          {label}
                        </span>
                      );
                    }

                    if (routePath) {
                      return (
                        <Link 
                          key={idx} 
                          to={routePath} 
                          className={`text-gray-600 text-sm py-1 ${indented ? 'pl-4' : ''} active:text-brand-orange`} 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {label}
                        </Link>
                      );
                    }

                    return (
                      <a 
                        key={idx} 
                        href="#" 
                        className={`text-gray-600 text-sm py-1 ${indented ? 'pl-4' : ''}`} 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <Link 
            to="/timeline" 
            className="bg-brand-orange text-white text-center font-bold px-6 py-4 rounded-full shadow-md mt-4 active:bg-orange-600 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Linha de tempo
          </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;