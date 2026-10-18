import React, { useState, useEffect } from 'react';
import { FLASH_DEALS } from '../data/products';
import { FlashDeal } from '../types';

interface FlashSaleProps {
  title?: string;
  discountText?: string;
  subtitle?: string;
  onAddDealToCart: (deal: FlashDeal) => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({
  title = 'Save Up To',
  discountText = '60% OFF',
  subtitle = 'Limited stock left for top trending summer products. Deal expires soon!',
  onAddDealToCart
}) => {
  const [seconds, setSeconds] = useState(18);
  const [minutes, setMinutes] = useState(42);
  const [hours, setHours] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 0) return prev - 1;
        setMinutes((m) => {
          if (m > 0) return m - 1;
          setHours((h) => (h > 0 ? h - 1 : 0));
          return 59;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="flash-sale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-red-500 via-red-600 to-amber-600 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          <div className="md:col-span-5 space-y-2">
            <div className="inline-block bg-white text-red-600 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              LIMITED TIME FLASH SALE
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {title} <span className="text-amber-300 font-black">{discountText}</span>
            </h3>
            <p className="text-xs text-red-100 font-medium">
              {subtitle}
            </p>
            
            {/* Live Countdown Timer */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] font-bold uppercase text-red-100">Ends in:</span>
              <div className="flex gap-1.5 font-mono text-xs font-extrabold text-slate-900 tabular-numbers">
                <span className="bg-white px-2 py-1 rounded-md shadow-xs">{hours < 10 ? `0${hours}` : hours}h</span>
                <span className="bg-white px-2 py-1 rounded-md shadow-xs">{minutes < 10 ? `0${minutes}` : minutes}m</span>
                <span className="bg-white px-2 py-1 rounded-md shadow-xs">{seconds < 10 ? `0${seconds}` : seconds}s</span>
              </div>
            </div>
          </div>

          {/* Featured Deal Items Horizontal */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FLASH_DEALS.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-xl p-2.5 text-slate-900 flex gap-3 items-center shadow-md hover:shadow-lg transition-shadow group"
              >
                <img
                  src={deal.image}
                  alt={deal.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-lg shrink-0 bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold text-red-600 uppercase">
                      Only {deal.leftCount} Left
                    </span>
                    <button
                      onClick={() => onAddDealToCart(deal)}
                      className="text-[9px] font-extrabold bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded transition-colors"
                    >
                      Grab Deal
                    </button>
                  </div>
                  <h5 className="text-xs font-bold truncate text-slate-800 mt-0.5">
                    {deal.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-1 tabular-numbers">
                    <span className="text-xs font-black text-red-600">${deal.price.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 line-through">${deal.oldPrice.toFixed(2)}</span>
                  </div>
                  {/* Stock Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className={`bg-red-500 h-full ${deal.stockRatio} rounded-full`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
