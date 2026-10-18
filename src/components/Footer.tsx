import React, { useState } from 'react';

interface FooterProps {
  storeName?: string;
  onNewsletterSubscribe: (email: string) => void;
  onFilterCategory: (category: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  storeName = 'EshaBuy',
  onNewsletterSubscribe,
  onFilterCategory,
  onOpenAdmin
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onNewsletterSubscribe(email.trim());
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-white pt-10 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <h4 className="text-xl font-extrabold tracking-tight">Join the {storeName} Style Club</h4>
            <p className="text-xs text-slate-400">
              Get instant access to secret drops and extra 15% discount on your first order.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 w-full sm:w-64"
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 font-extrabold px-5 py-2 rounded-xl text-xs uppercase tracking-wider text-white transition-colors shrink-0"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-slate-400">
          <div className="space-y-2">
            <h6 className="font-extrabold text-white text-xs uppercase tracking-wider">Shop</h6>
            <p onClick={() => onFilterCategory('All')} className="hover:text-white cursor-pointer transition-colors">New Arrivals</p>
            <p onClick={() => onFilterCategory('All')} className="hover:text-white cursor-pointer transition-colors">Best Sellers</p>
            <p onClick={() => onFilterCategory('Tops & Dresses')} className="hover:text-white cursor-pointer transition-colors">Women Dresses</p>
            <p onClick={() => onFilterCategory('Footwear')} className="hover:text-white cursor-pointer transition-colors">Footwear</p>
          </div>

          <div className="space-y-2">
            <h6 className="font-extrabold text-white text-xs uppercase tracking-wider">Company</h6>
            <p className="hover:text-white cursor-pointer transition-colors">About Us</p>
            <p className="hover:text-white cursor-pointer transition-colors">Careers</p>
            <p className="hover:text-white cursor-pointer transition-colors">Sustainability</p>
            <p className="hover:text-white cursor-pointer transition-colors">Press & Media</p>
          </div>

          <div className="space-y-2">
            <h6 className="font-extrabold text-white text-xs uppercase tracking-wider">Support</h6>
            <p className="hover:text-white cursor-pointer transition-colors">Help Center</p>
            <p className="hover:text-white cursor-pointer transition-colors">Shipping & Delivery</p>
            <p className="hover:text-white cursor-pointer transition-colors">Returns & Exchanges</p>
            <p className="hover:text-white cursor-pointer transition-colors">Order Status</p>
          </div>

          <div className="space-y-2">
            <h6 className="font-extrabold text-white text-xs uppercase tracking-wider">Follow Us</h6>
            <div className="flex gap-3 text-base text-slate-300">
              <i className="fa-brands fa-instagram hover:text-amber-400 cursor-pointer transition-colors"></i>
              <i className="fa-brands fa-tiktok hover:text-amber-400 cursor-pointer transition-colors"></i>
              <i className="fa-brands fa-pinterest hover:text-amber-400 cursor-pointer transition-colors"></i>
              <i className="fa-brands fa-facebook hover:text-amber-400 cursor-pointer transition-colors"></i>
            </div>
            <p className="text-[10px] text-slate-500 pt-2">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="hover:text-amber-400 font-bold transition-colors cursor-pointer select-none px-0.5"
                title="Admin Panel (Credentials: es123)"
                aria-label="Open Admin Panel"
              >
                ©
              </button>{' '}
              2026 {storeName}. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
