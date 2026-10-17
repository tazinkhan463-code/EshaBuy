import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  promoCode: string;
  discountRate: number;
  onApplyPromo: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  promoCode,
  discountRate,
  onApplyPromo
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ msg: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = rawSubtotal * discountRate;
  const finalSubtotal = Math.max(0, rawSubtotal - discountAmount);

  const freeThreshold = 75.0;
  const diff = freeThreshold - finalSubtotal;
  const progressRatio = Math.min(100, (finalSubtotal / freeThreshold) * 100);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = onApplyPromo(promoInput.trim().toUpperCase());
    if (ok) {
      setPromoStatus({ msg: 'Promo code applied! 20% OFF deducted.', isError: false });
    } else {
      setPromoStatus({ msg: 'Invalid code. Try ESHABUY20', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-bag-shopping text-amber-400 text-base"></i>
              <h4 className="font-extrabold text-sm">Shopping Bag</h4>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="text-slate-400 hover:text-white text-lg p-1"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Shipping Progress Bar */}
          <div className="bg-sky-50 px-4 py-2 border-b border-sky-100">
            <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
              <span>
                {diff <= 0
                  ? '🎉 Congratulations! You unlocked FREE Express Shipping!'
                  : `Add $${diff.toFixed(2)} more for Free Shipping`}
              </span>
              <i className="fa-solid fa-truck text-sky-600"></i>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressRatio}%` }}
              ></div>
            </div>
          </div>

          {/* Drawer Cart Items Container */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="text-center py-14 text-slate-400">
                <i className="fa-solid fa-bag-shopping text-3xl mb-2 text-slate-300"></i>
                <p className="font-bold text-xs text-slate-700">Your bag is empty</p>
                <p className="text-[10px]">Add items to start shopping!</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pt-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg shrink-0 bg-slate-100 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h6 className="font-bold text-xs text-slate-800 truncate">{item.name}</h6>
                    {item.selectedSize && (
                      <span className="text-[10px] text-slate-400 block">
                        Size: {item.selectedSize}
                      </span>
                    )}
                    <p className="text-xs font-black text-sky-600 tabular-numbers">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-5 h-5 rounded bg-slate-100 font-bold text-xs flex items-center justify-center hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold tabular-numbers">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-5 h-5 rounded bg-slate-100 font-bold text-xs flex items-center justify-center hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item"
                    className="text-slate-300 hover:text-red-500 p-1"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center font-bold text-slate-900 text-sm">
                <span>Subtotal</span>
                <span className="text-sky-600 font-black tabular-numbers">
                  ${finalSubtotal.toFixed(2)}
                </span>
              </div>
              {discountRate > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold">
                  <span>Discount (20% OFF):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <form onSubmit={handleApply} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (ESHABUY20)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 uppercase"
              />
              <button
                type="submit"
                className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors"
              >
                Apply
              </button>
            </form>

            {promoStatus && (
              <p className={`text-[10px] font-bold ${promoStatus.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                {promoStatus.msg}
              </p>
            )}

            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-extrabold py-3 rounded-xl shadow-md transition-transform active:scale-98 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>CHECKOUT NOW</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
