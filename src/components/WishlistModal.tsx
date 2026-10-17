import React from 'react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: Set<string>;
  products: Product[];
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (p: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onRemoveFromWishlist,
  onAddToCart
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.has(p.id));

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5 relative border border-slate-100 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-heart text-red-500"></i>
            <h4 className="font-extrabold text-sm text-slate-800">
              Your Wishlist ({wishlistedProducts.length})
            </h4>
          </div>
          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 my-3 space-y-2 divide-y divide-slate-100">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <i className="fa-regular fa-heart text-3xl mb-2 text-slate-300"></i>
              <p className="font-bold text-xs text-slate-700">Your wishlist is empty</p>
              <p className="text-[10px]">Tap the heart icon on any product to save it here.</p>
            </div>
          ) : (
            wishlistedProducts.map((p) => (
              <div key={p.id} className="pt-2 flex items-center gap-3">
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-cover rounded-lg shrink-0 bg-slate-100 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h6 className="font-bold text-xs text-slate-800 truncate">{p.name}</h6>
                  <p className="text-xs font-black text-sky-600 tabular-numbers">
                    ${p.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(p);
                      onRemoveFromWishlist(p.id);
                    }}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1"
                  >
                    <i className="fa-solid fa-bag-shopping"></i> Add
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(p.id)}
                    aria-label="Remove from wishlist"
                    className="text-slate-300 hover:text-red-500 p-1"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
