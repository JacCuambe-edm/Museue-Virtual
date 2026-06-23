import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SearchModal from './SearchModal';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = isHome && !scrolled;

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
        { label: 'Galeria dos presidentes', routePath: '/galeria-presidentes' }
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent border-b border-white/10'
          : 'bg-white border-b border-gray-100 shadow-sm'
      }`}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="tracking-tight transition-colors"
            style={{
              fontFamily: 'Epilogue, sans-serif',
              fontSize: '24px',
              fontWeight: 600,
              color: transparent ? '#ffffff' : '#fb8626',
            }}
          >
            Museu
          </Link>
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
                  className="flex items-center text-sm font-medium transition-colors hover:text-orange-400"
                  style={{ color: transparent ? 'rgba(255,255,255,0.9)' : '#212121' }}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="flex items-center text-sm font-medium transition-colors hover:text-orange-400"
                  style={{ color: transparent ? 'rgba(255,255,255,0.9)' : '#212121' }}
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

        {/* Search + Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className={`p-2.5 rounded-full border transition-colors ${
              transparent
                ? 'border-white/30 text-white hover:bg-white/10 hover:border-white/60'
                : 'border-gray-200 text-gray-500 hover:text-orange-500 hover:border-orange-300'
            }`}
            aria-label="Pesquisar"
          >
            <Search size={18} />
          </button>
          <Link
            to="/timeline"
            className="text-sm font-semibold px-8 py-3 rounded-full transition-all shadow-lg text-white hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: '#fb8626' }}
          >
            Linha de tempo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden transition-colors"
          style={{ color: transparent ? '#ffffff' : '#fb8626' }}
          onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileOpenSection(null); }}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Search Modal */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[80px] bottom-0 bg-white z-40 overflow-y-auto">
          <div className="flex flex-col p-6 space-y-6 pb-24">
          <button
            onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-gray-500 hover:text-orange-500 hover:border-orange-300 transition-colors text-sm"
          >
            <Search size={16} />
            Pesquisar no museu...
          </button>
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
                  onClick={() => setMobileOpenSection(mobileOpenSection === link.name ? null : link.name)}
                >
                  {link.name}
                  {link.subItems && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${mobileOpenSection === link.name ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>
              )}
              {link.subItems && mobileOpenSection === link.name && (
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