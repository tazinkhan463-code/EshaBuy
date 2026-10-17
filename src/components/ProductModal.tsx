import React, { useState } from 'react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState('M');

  if (!product) return null;

  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 relative overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-xl z-10 p-1"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="rounded-xl overflow-hidden h-48 sm:h-56 bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-sky-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-amber-500 font-bold text-xs">
                ★ {product.rating}
              </span>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h4>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex items-center gap-2 tabular-numbers">
              <span className="text-lg font-black text-sky-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700">Size:</label>
              <div className="flex gap-1.5">
                {sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`w-7 h-7 rounded-md border text-[10px] font-bold transition-all ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-sky-600'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                onAddToCart(product, selectedSize);
                onClose();
              }}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold py-2.5 rounded-xl shadow-xs text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-98"
            >
              <i className="fa-solid fa-bag-shopping"></i>
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
