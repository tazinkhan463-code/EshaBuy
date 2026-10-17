import React, { useState } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CartItem, FlashDeal } from './types';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickCategories } from './components/QuickCategories';
import { NewArrivals } from './components/NewArrivals';
import { FlashSale } from './components/FlashSale';
import { Catalog } from './components/Catalog';
import { WhyUs } from './components/WhyUs';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { ProductModal } from './components/ProductModal';
import { WishlistModal } from './components/WishlistModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { HelpModal } from './components/HelpModal';
import { Toast } from './components/Toast';

export default function App() {
  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [currentFilter, setCurrentFilter] = useState('All');
  const [promoCode, setPromoCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [recentOrderId, setRecentOrderId] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size = 'M') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            oldPrice: product.oldPrice,
            image: product.image,
            quantity: 1,
            selectedSize: size
          }
        ];
      }
    });
    showToast(`${product.name} added to your bag!`);
  };

  const handleAddDealToCart = (deal: FlashDeal) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === deal.id);
      if (existing) {
        return prev.map((item) =>
          item.id === deal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prev,
          {
            id: deal.id,
            name: deal.name,
            category: 'Flash Deal',
            price: deal.price,
            oldPrice: deal.oldPrice,
            image: deal.image,
            quantity: 1,
            selectedSize: 'One Size'
          }
        ];
      }
    });
    showToast(`${deal.name} deal added to your bag!`);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from bag');
  };

  // Wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        showToast('Removed from Wishlist');
      } else {
        next.add(productId);
        showToast('Added to Wishlist');
      }
      return next;
    });
  };

  // Promo code
  const handleApplyPromo = (code: string) => {
    if (code === 'ESHABUY20') {
      setPromoCode('ESHABUY20');
      setDiscountRate(0.2);
      showToast('20% Discount Code applied!');
      return true;
    }
    return false;
  };

  // Order success
  const handleOrderSuccess = (orderId: string, customerName: string) => {
    setRecentOrderId(orderId);
    setCart([]);
    showToast(`Order #${orderId} confirmed! Thank you, ${customerName}.`);
  };

  // Newsletter
  const handleNewsletter = (email: string) => {
    showToast(`Subscribed! 15% promo code sent to ${email}`);
  };

  // Navigation helpers
  const handleSelectCategory = (category: string) => {
    setCurrentFilter(category);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFlashSale = () => {
    const flashEl = document.getElementById('flash-sale');
    if (flashEl) flashEl.scrollIntoView({ behavior: 'smooth' });
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-slate-50 font-sans text-slate-800 antialiased selection:bg-amber-400 selection:text-slate-900 min-h-screen flex flex-col overflow-x-hidden">
      {/* Announcement Bar */}
      <AnnouncementBar
        onOpenPromo={() => {
          handleApplyPromo('ESHABUY20');
          setIsCartOpen(true);
        }}
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Sticky Header */}
      <Header
        cartCount={cartTotalCount}
        wishlistCount={wishlist.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1">
        {/* Compact Hero Banner */}
        <Hero
          onExploreCatalog={scrollToCatalog}
          onViewFlashSale={scrollToFlashSale}
        />

        {/* Quick Categories Bar */}
        <QuickCategories onSelectCategory={handleSelectCategory} />

        {/* New Arrivals Section */}
        <NewArrivals
          products={PRODUCTS}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onOpenModal={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p)}
          onBrowseCatalog={scrollToCatalog}
        />

        {/* Compact Flash Sale & Limited Edition Banner */}
        <FlashSale onAddDealToCart={handleAddDealToCart} />

        {/* Main Product Catalog with Filter Tabs */}
        <Catalog
          products={PRODUCTS}
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onOpenModal={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p)}
        />

        {/* Why EshaBuy / Value Proposition */}
        <WhyUs />
      </main>

      {/* Footer */}
      <Footer
        onNewsletterSubscribe={handleNewsletter}
        onFilterCategory={handleSelectCategory}
      />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        promoCode={promoCode}
        discountRate={discountRate}
        onApplyPromo={handleApplyPromo}
      />

      {/* Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Quick View Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={PRODUCTS}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discountRate={discountRate}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Track Order Modal */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        recentOrderId={recentOrderId}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
