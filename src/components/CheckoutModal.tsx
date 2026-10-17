import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountRate: number;
  onOrderSuccess: (orderId: string, name: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountRate,
  onOrderSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'apple'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = rawSubtotal * discountRate;
  const isFreeShipping = rawSubtotal - discountAmount >= 75;
  const shippingFee = isFreeShipping ? 0 : 9.99;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount + shippingFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !address.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `EB-${Math.floor(10000 + Math.random() * 90000)}`;
      onOrderSuccess(generatedId, name);
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Secure Checkout</h3>
            <p className="text-xs text-slate-400">Complete your shipping & payment details</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Order summary mini-card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Items Total ({items.reduce((s, i) => s + i.quantity, 0)})</span>
              <span className="tabular-numbers">${rawSubtotal.toFixed(2)}</span>
            </div>
            {discountRate > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Voucher (20% OFF)</span>
                <span className="tabular-numbers">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span className="font-semibold text-slate-800 tabular-numbers">
                {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
              <span>Grand Total</span>
              <span className="text-sky-600 font-black tabular-numbers">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jessica Taylor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="123 Fashion Ave"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  City / State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="New York, NY"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <i className="fa-regular fa-credit-card block text-sm mb-1"></i>
                  <span className="text-[10px] block">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'apple'
                      ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <i className="fa-brands fa-apple block text-sm mb-1"></i>
                  <span className="text-[10px] block">Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <i className="fa-solid fa-money-bill-wave block text-sm mb-1"></i>
                  <span className="text-[10px] block">Cash on Delivery</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold py-3 rounded-xl shadow-md text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <i className="fa-solid fa-lock text-xs"></i>
                <span>PAY ${grandTotal.toFixed(2)} & PLACE ORDER</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
