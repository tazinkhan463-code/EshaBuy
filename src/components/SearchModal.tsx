import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const matches = query.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-5 relative border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close search"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <h4 className="text-sm font-bold text-slate-800 mb-3">Instant Product Search</h4>

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search sneakers, floral dresses, denim jackets, handbags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 text-xs text-slate-800 font-medium"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
        </div>

        <div className="mt-3 max-h-64 overflow-y-auto space-y-1 divide-y divide-slate-100">
          {query.trim() !== '' && matches.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No products found matching "{query}"
            </div>
          )}

          {matches.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectProduct(p);
                onClose();
              }}
              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
            >
              <img
                src={p.image}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-slate-800 truncate">{p.name}</p>
                <p className="text-[10px] text-slate-400">${p.price.toFixed(2)} · {p.category}</p>
              </div>
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                View
              </span>
            </div>
          ))}

          {query.trim() === '' && (
            <div className="p-3 text-center text-xs text-slate-400">
              Type keywords like "dress", "jacket", "sneakers", or "watch"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
