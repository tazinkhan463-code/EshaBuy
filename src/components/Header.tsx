import React, { useState } from 'react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-slate-700 hover:text-sky-600 p-1.5 rounded-lg focus:outline-none"
              aria-label="Open Menu"
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>

            {/* BRAND LOGO */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="bg-sky-600 text-white font-extrabold text-lg px-2.5 py-0.5 rounded-xl shadow-xs transform -rotate-2 group-hover:rotate-0 transition-transform">
                E
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Esha<span className="text-sky-600">Buy</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 font-semibold text-xs tracking-wide uppercase">
            <a href="#hero" className="text-slate-700 hover:text-sky-600 transition-colors">
              Home
            </a>
            <a
              href="#new-arrivals"
              className="text-slate-700 hover:text-sky-600 transition-colors flex items-center gap-1"
            >
              <span>New Arrivals</span>
              <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-sm font-bold">
                HOT
              </span>
            </a>
            <a href="#catalog" className="text-slate-700 hover:text-sky-600 transition-colors">
              Collections
            </a>
            <a href="#flash-sale" className="text-slate-700 hover:text-sky-600 transition-colors">
              Flash Sale
            </a>
            <a href="#benefits" className="text-slate-700 hover:text-sky-600 transition-colors">
              Why Us
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Compact Search Button */}
            <button
              onClick={onOpenSearch}
              className="text-slate-600 hover:text-sky-600 hover:bg-slate-100 p-2 rounded-full transition-all"
              title="Search"
            >
              <i className="fa-solid fa-magnifying-glass text-lg"></i>
            </button>

            {/* Wishlist Counter */}
            <button
              onClick={onOpenWishlist}
              className="text-slate-600 hover:text-red-500 hover:bg-slate-100 p-2 rounded-full relative transition-all"
              title="Wishlist"
            >
              <i className="fa-regular fa-heart text-lg"></i>
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-xs text-xs"
            >
              <i className="fa-solid fa-bag-shopping text-sm"></i>
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-white text-sky-600 text-[11px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold ml-0.5">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-t border-slate-800 px-6 py-4 space-y-2 text-xs font-semibold animate-in fade-in">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-amber-400"
          >
            Home
          </a>
          <a
            href="#new-arrivals"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-amber-400"
          >
            New Arrivals
          </a>
          <a
            href="#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-amber-400"
          >
            Collections Catalog
          </a>
          <a
            href="#flash-sale"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-amber-400 font-bold"
          >
            Flash Sale Offers
          </a>
          <a
            href="#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-amber-400"
          >
            Why Us
          </a>
        </div>
      )}
    </header>
  );
};
