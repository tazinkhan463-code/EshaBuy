import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenModal: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenModal,
  onAddToCart
}) => {
  return (
    <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      {/* Thumbnail area */}
      <div
        className="relative overflow-hidden rounded-lg h-40 sm:h-44 mb-2 bg-slate-100 cursor-pointer"
        onClick={() => onOpenModal(product)}
      >
        <span className="absolute top-2 left-2 z-10 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
          {product.badge}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-xs"
        >
          <i
            className={`${
              isWishlisted ? 'fa-solid text-red-500' : 'fa-regular'
            } fa-heart text-xs`}
          ></i>
        </button>

        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info & Buy Action */}
      <div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-0.5">
          <span>{product.category}</span>
          <span className="text-amber-500 font-bold">★ {product.rating}</span>
        </div>

        <h5
          onClick={() => onOpenModal(product)}
          className="font-bold text-xs text-slate-800 line-clamp-1 mb-1.5 cursor-pointer hover:text-sky-600 transition-colors"
          title={product.name}
        >
          {product.name}
        </h5>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1 tabular-numbers">
            <span className="font-black text-xs text-sky-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 line-through">
              ${product.oldPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] px-2 py-1 rounded-lg shadow-xs transition-all active:scale-95 flex items-center gap-1"
          >
            <i className="fa-solid fa-plus text-[9px]"></i> Add
          </button>
        </div>
      </div>
    </div>
  );
};
