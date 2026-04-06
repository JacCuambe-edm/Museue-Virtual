import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-20"
          alt="Dark industrial power plant interior"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLIQJOSTF0SN_E0mpYfrbKF25J-SxDBeQ482BmTFcKbIIdKWA3LSSXKAiqO099siW2Xz6gEcPMrt4259U-IfH_9F-BfJ-wbBYU98b251ossLoblq8zIu2DwXSvyh4Px5-O28UqARaxhMfC9jSJ6SXRBCQ-UxTlkMzNZJOVh16z9hcEDHWBSLBwqH5VR9KRktyTfnkE9LI7LFFLodYPk5pywKhNi9X1u1cCqwJi2pXgQ-pa2-H-ncqHtB7IwnpenkTwhjpIGxB0QseG"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-5xl animate-fade-in-up">
        <h1 className="text-5xl md:text-8xl font-black font-headline tracking-tighter text-on-surface leading-[0.9] mb-8">
          EXPLORE O PERCURSO HISTÓRICO DA EDM
        </h1>
        <p className="text-lg md:text-xl text-on-surface/70 max-w-2xl mx-auto mb-10 font-medium font-body">
          Conecte-se com a historia da EDM
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/timeline" className="bg-primary-container text-on-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-container/90 transition-all flex items-center justify-center gap-2">
            Ver história
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Timeline Progress Indicator (Side) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-24 bg-outline-variant"></div>
        <div className="w-2 h-2 rounded-full bg-primary-container"></div>
        <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
        <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
        <div className="w-px h-24 bg-outline-variant"></div>
      </div>
    </section>
  );
};

export default Hero;