import React from 'react';

interface HeroProps {
  badge?: string;
  headline?: string;
  highlight?: string;
  description?: string;
  image1?: string;
  image2?: string;
  statSold?: string;
  statRating?: string;
  statDispatch?: string;
  onExploreCatalog: () => void;
  onViewFlashSale: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  badge = 'New Season 2026 Collection Dropped',
  headline = 'Elevate Your Everyday',
  highlight = 'Wardrobe Essentials',
  description = 'Discover modern streetwear, elegant dresses, premium accessories, and footwear crafted for effortless daily style.',
  image1 = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  image2 = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  statSold = '12k+',
  statRating = '4.9 ★',
  statDispatch = '24h',
  onExploreCatalog,
  onViewFlashSale
}) => {
  return (
    <section id="hero" className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-[#0369a1] text-white py-10 lg:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Text Info */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-amber-400 text-xs font-semibold">
              <i className="fa-solid fa-sparkles text-xs"></i>
              <span>{badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {headline} <br className="hidden sm:inline" />
              <span className="text-amber-400 font-hand text-4xl sm:text-5xl lg:text-6xl font-normal inline-block transform -rotate-1">
                {highlight}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <a
                href="#catalog"
                onClick={(e) => {
                  e.preventDefault();
                  onExploreCatalog();
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>EXPLORE CATALOG</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </a>
              <a
                href="#flash-sale"
                onClick={(e) => {
                  e.preventDefault();
                  onViewFlashSale();
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                VIEW SPECIAL OFFERS
              </a>
            </div>

            {/* Trust Stats Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/60 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-lg font-black text-white tabular-numbers">{statSold}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Products Sold</p>
              </div>
              <div>
                <p className="text-lg font-black text-white tabular-numbers">{statRating}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Customer Rating</p>
              </div>
              <div>
                <p className="text-lg font-black text-white tabular-numbers">{statDispatch}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Fast Dispatch</p>
              </div>
            </div>
          </div>

          {/* Hero Compact Visual Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="relative group rounded-2xl overflow-hidden shadow-lg h-44 sm:h-56 bg-slate-800">
              <img
                src={image1}
                alt="Women's Apparel Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent p-3 flex items-end">
                <span className="text-xs font-bold text-white">Women's Apparel</span>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden shadow-lg h-44 sm:h-56 bg-slate-800">
              <img
                src={image2}
                alt="Footwear Edition Collection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent p-3 flex items-end">
                <span className="text-xs font-bold text-white">Footwear Edition</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
