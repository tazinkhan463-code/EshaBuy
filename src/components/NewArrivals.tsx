import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface NewArrivalsProps {
  products: Product[];
  wishlist: Set<string>;
  onToggleWishlist: (productId: string) => void;
  onOpenModal: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBrowseCatalog: () => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onOpenModal,
  onAddToCart,
  onBrowseCatalog
}) => {
  const newArrivalItems = products.slice(0, 8);

  return (
    <section id="new-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider">
            Fresh Drops
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Just Dropped / New Arrivals
          </h2>
        </div>
        <a
          href="#catalog"
          onClick={(e) => {
            e.preventDefault();
            onBrowseCatalog();
          }}
          className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
        >
          <span>Browse Full Catalog</span>
          <i className="fa-solid fa-arrow-right text-[10px]"></i>
        </a>
      </div>

      {/* 8 Compact Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {newArrivalItems.map((product) => (
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
