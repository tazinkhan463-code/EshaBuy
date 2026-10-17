import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogProps {
  products: Product[];
  currentFilter: string;
  onFilterChange: (category: string) => void;
  wishlist: Set<string>;
  onToggleWishlist: (productId: string) => void;
  onOpenModal: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  currentFilter,
  onFilterChange,
  wishlist,
  onToggleWishlist,
  onOpenModal,
  onAddToCart
}) => {
  const tabs = [
    { id: 'All', label: 'All Items' },
    { id: 'Tops & Dresses', label: 'Tops & Dresses' },
    { id: 'Outerwear', label: 'Outerwear' },
    { id: 'Footwear', label: 'Footwear' },
    { id: 'Bags & Accessories', label: 'Bags & Accessories' }
  ];

  const filteredProducts =
    currentFilter === 'All'
      ? products
      : products.filter((p) => p.category === currentFilter);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider">
            Curated Collections
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Explore Full Product Store
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`filter-tab px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'active bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Catalog Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlist.has(product.id)}
            onToggleWishlist={onToggleWishlist}
            onOpenModal={onOpenModal}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};
