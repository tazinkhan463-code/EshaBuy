import React from 'react';

interface QuickCategoriesProps {
  onSelectCategory: (category: string) => void;
}

export const QuickCategories: React.FC<QuickCategoriesProps> = ({ onSelectCategory }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-20">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <button
          onClick={() => onSelectCategory('Tops & Dresses')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform shrink-0">
            <i className="fa-solid fa-shirt"></i>
          </div>
          <div className="text-left">
            <p className="text-xs font-extrabold text-slate-800">Dresses</p>
            <p className="text-[10px] text-slate-400">140+ Items</p>
          </div>
        </button>

        <button
          onClick={() => onSelectCategory('Outerwear')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform shrink-0">
            <i className="fa-solid fa-vest"></i>
          </div>
          <div className="text-left">
            <p className="text-xs font-extrabold text-slate-800">Jackets</p>
            <p className="text-[10px] text-slate-400">85+ Items</p>
          </div>
        </button>

        <button
          onClick={() => onSelectCategory('Footwear')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-rose-100 text-red-500 flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform shrink-0">
            <i className="fa-solid fa-shoe-prints"></i>
          </div>
          <div className="text-left">
            <p className="text-xs font-extrabold text-slate-800">Footwear</p>
            <p className="text-[10px] text-slate-400">92+ Items</p>
          </div>
        </button>

        <button
          onClick={() => onSelectCategory('Bags & Accessories')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform shrink-0">
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <div className="text-left">
            <p className="text-xs font-extrabold text-slate-800">Handbags</p>
            <p className="text-[10px] text-slate-400">64+ Items</p>
          </div>
        </button>

        <button
          onClick={() => onSelectCategory('Bags & Accessories')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform shrink-0">
            <i className="fa-solid fa-glasses"></i>
          </div>
          <div className="text-left">
            <p className="text-xs font-extrabold text-slate-800">Eyewear</p>
            <p className="text-[10px] text-slate-400">45+ Items</p>
          </div>
        </button>

        <button
          onClick={() => onSelectCategory('All')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform shrink-0">
            <i className="fa-solid fa-table-cells-large"></i>
          </div>
          <div className="text-left">
            <p className="text-xs font-extrabold text-slate-800">View All</p>
            <p className="text-[10px] text-slate-400">Full Store</p>
          </div>
        </button>
      </div>
    </section>
  );
};
