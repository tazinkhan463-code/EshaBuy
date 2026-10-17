import React from 'react';

export const WhyUs: React.FC = () => {
  return (
    <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-base shrink-0">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div>
            <h6 className="font-extrabold text-xs text-slate-900">Fast Express Delivery</h6>
            <p className="text-[10px] text-slate-500">Free shipping over $75</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base shrink-0">
            <i className="fa-solid fa-rotate-left"></i>
          </div>
          <div>
            <h6 className="font-extrabold text-xs text-slate-900">30 Days Returns</h6>
            <p className="text-[10px] text-slate-500">Hassle-free guarantee</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base shrink-0">
            <i className="fa-solid fa-shield-check"></i>
          </div>
          <div>
            <h6 className="font-extrabold text-xs text-slate-900">100% Safe Payments</h6>
            <p className="text-[10px] text-slate-500">Encrypted checkout</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-base shrink-0">
            <i className="fa-solid fa-headset"></i>
          </div>
          <div>
            <h6 className="font-extrabold text-xs text-slate-900">24/7 Dedicated Support</h6>
            <p className="text-[10px] text-slate-500">Live chat available</p>
          </div>
        </div>
      </div>
    </section>
  );
};
