import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      {/* Big 404 */}
      <div className="relative mb-8">
        <span className="text-[10rem] sm:text-[14rem] font-black text-gray-100 select-none leading-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 rotate-12">
            <span className="text-white text-4xl sm:text-5xl font-black -rotate-12">!</span>
          </div>
        </div>
      </div>

      {/* Message */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Página não encontrada
      </h1>
      <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
        A página que procura não existe ou foi movida. Volte à página inicial e continue a explorar o Museu Virtual da EDM.
      </p>

      {/* EDM Brand bar */}
      <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-10" />

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-orange-500/30"
        >
          <Home className="w-5 h-5" />
          Ir para o Início
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-full hover:border-orange-400 hover:text-orange-600 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-32 h-32 border-4 border-orange-100 rounded-full opacity-60 hidden md:block" />
      <div className="absolute bottom-20 right-10 w-48 h-48 border-4 border-orange-50 rounded-full opacity-60 hidden md:block" />
    </div>
  );
};

export default NotFound;
