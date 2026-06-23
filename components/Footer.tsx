import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const quickLinks = [
    { label: 'Sobre o Museu', path: '/sobre-museu' },
    { label: 'Apresentação EDM', path: '/apresentacao-empresa' },
    { label: 'História', path: '/historia-geracao' },
    { label: 'Exposições', path: '/exposicoes' },
  ];

  const serviceLinks = [
    { label: 'Geração', path: '/geracao' },
    { label: 'Transporte', path: '/transporte' },
    { label: 'Distribuição', path: '/distribuicao' },
    { label: 'Comercial', path: '/comercial' },
  ];

  return (
    <footer style={{ backgroundColor: '#505355' }} className="text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col items-center md:items-start">
            <h3 className="text-3xl font-bold mb-4">MUSEU</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-xs md:max-w-none mx-auto md:mx-0">
              Electricidade de Moçambique: 48 anos de história, preservando o patrimônio e traçando narrativas que iluminam a transformação de Moçambique.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/edm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-brand-orange transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://linkedin.com/company/edm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-brand-orange transition-all duration-300"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://youtube.com/@edm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-brand-orange transition-all duration-300"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-bold mb-6">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-white/80 text-sm hover:text-white hover:pl-2 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-bold mb-6">Áreas de Negócio</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-white/80 text-sm hover:text-white hover:pl-2 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-bold mb-6">Localização</h4>
            <div className="space-y-4 text-sm w-full max-w-xs md:max-w-none mx-auto md:mx-0">
              <div className="flex items-center md:items-start gap-3 justify-center md:justify-start">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <div className="text-white/80 text-left">
                  <p>22HMJ+3V4, Avenida Eduardo</p>
                  <p>Mondlane, Maputo</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Mail size={18} className="flex-shrink-0" />
                <a 
                  href="mailto:academia@edm.co.mz" 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  academia@edm.co.mz
                </a>
              </div>
              
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Phone size={18} className="flex-shrink-0" />
                <a 
                  href="tel:+25882948487" 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  +258 82 94 84 87
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Electricidade de Moçambique. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;