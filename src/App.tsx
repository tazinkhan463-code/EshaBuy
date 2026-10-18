import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { DEFAULT_SITE_SETTINGS, INITIAL_ORDERS } from './data/defaultSettings';
import { Product, CartItem, FlashDeal, SiteSettings, CustomerOrder } from './types';
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
import { RenameAppModal } from './components/RenameAppModal';
import { AdminModal } from './components/AdminModal';
import { Toast } from './components/Toast';
import { safeLocalStorageSet } from './utils/storage';
import {
  subscribeProducts,
  subscribeSiteSettings,
  subscribeOrders,
  saveProductToFirestore,
  saveSiteSettingsToFirestore,
  saveOrderToFirestore,
  updateOrderStatusInFirestore
} from './services/firebase';

export default function App() {
  // Site Settings (Editable via Admin Panel)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('eshabuy_site_settings');
      if (saved) return JSON.parse(saved);
      const savedName = localStorage.getItem('eshabuy_store_name');
      if (savedName) return { ...DEFAULT_SITE_SETTINGS, storeName: savedName };
    } catch {
      // fallback
    }
    return DEFAULT_SITE_SETTINGS;
  });

  // Product Inventory (Editable via Admin Panel)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('eshabuy_products_list');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return PRODUCTS;
  });

  // Orders Management (Editable via Admin Panel)
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('eshabuy_orders_list');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [currentFilter, setCurrentFilter] = useState('All');
  const [promoCode, setPromoCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);

  // Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [recentOrderId, setRecentOrderId] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Real-time Firebase Firestore Listeners
  useEffect(() => {
    // 1. Site Settings & Branding
    const unsubSettings = subscribeSiteSettings((liveSettings) => {
      if (liveSettings && liveSettings.storeName) {
        setSiteSettings(liveSettings);
        safeLocalStorageSet('eshabuy_site_settings', liveSettings);
        document.title = `${liveSettings.storeName} | ${liveSettings.storeTagline || 'Modern Fashion'}`;
      }
    });

    // 2. Catalog Products
    const unsubProducts = subscribeProducts((liveProducts) => {
      if (liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
        safeLocalStorageSet('eshabuy_products_list', liveProducts);
      }
    });

    // 3. Customer Orders
    const unsubOrders = subscribeOrders((liveOrders) => {
      if (liveOrders) {
        setOrders(liveOrders);
        safeLocalStorageSet('eshabuy_orders_list', liveOrders);
      }
    });

    return () => {
      unsubSettings();
      unsubProducts();
      unsubOrders();
    };
  }, []);

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
    const targetCode = siteSettings.promoCode || 'ESHABUY20';
    if (code.toUpperCase() === targetCode.toUpperCase()) {
      setPromoCode(targetCode);
      const rate = (siteSettings.promoDiscountPercent || 20) / 100;
      setDiscountRate(rate);
      showToast(`${siteSettings.promoDiscountPercent || 20}% Discount Code applied!`);
      return true;
    }
    return false;
  };

  // Order success
  const handleOrderSuccess = (orderId: string, customerName: string) => {
    setRecentOrderId(orderId);
    
    // Create new customer order entry for admin viewer
    const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const discount = subtotal * discountRate;
    const isFree = subtotal - discount >= (siteSettings.freeShippingThreshold || 75);
    const shipping = isFree ? 0 : 9.99;
    const grandTotal = Math.max(0, subtotal - discount + shipping);

    const newOrder: CustomerOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName,
      email: `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: 'Express Delivery Address',
      city: 'Customer Location',
      paymentMethod: 'Credit Card (Paid)',
      items: [...cart],
      subtotal,
      discount,
      shipping,
      grandTotal,
      status: 'Packed & Inspected'
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    safeLocalStorageSet('eshabuy_orders_list', updatedOrders);

    // Save order directly to Firestore
    saveOrderToFirestore(newOrder).catch((err) =>
      console.warn('Order saved locally, Firestore sync pending:', err)
    );

    setCart([]);
    showToast(`Order #${orderId} confirmed! Thank you, ${customerName}.`);
  };

  // Newsletter
  const handleNewsletter = (email: string) => {
    showToast(`Subscribed! 15% promo code sent to ${email}`);
  };

  // Update Store Branding & Logo (Quick Modal)
  const handleUpdateStoreBranding = (updates: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...updates };
    setSiteSettings(updated);
    safeLocalStorageSet('eshabuy_site_settings', updated);
    if (updates.storeName) {
      safeLocalStorageSet('eshabuy_store_name', updates.storeName);
      document.title = `${updates.storeName} | Modern Fashion & Style Destination`;
    }
    // Sync to Firestore
    saveSiteSettingsToFirestore(updated).catch((err) =>
      console.warn('Branding saved locally, Firestore sync pending:', err)
    );
    showToast(`Store branding & logo updated!`);
  };

  // Admin: Save All Settings
  const handleAdminSaveSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    safeLocalStorageSet('eshabuy_site_settings', newSettings);
    safeLocalStorageSet('eshabuy_store_name', newSettings.storeName);
    document.title = `${newSettings.storeName} | ${newSettings.storeTagline}`;
    // Sync to Firestore
    saveSiteSettingsToFirestore(newSettings).catch((err) =>
      console.warn('Settings saved locally, Firestore sync pending:', err)
    );
    showToast('Store settings & logo updated & saved to Firebase!');
  };

  // Admin: Save Products Catalog
  const handleAdminSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    safeLocalStorageSet('eshabuy_products_list', newProducts);
    // Sync catalog products to Firestore
    Promise.all(newProducts.map((p) => saveProductToFirestore(p)))
      .then(() => showToast('Product catalog inventory updated & synced to Firebase!'))
      .catch((err) => {
        console.warn('Catalog saved locally, Firestore sync pending:', err);
        showToast('Product catalog inventory updated!');
      });
  };

  // Quick Direct Product Photo Update & Optimize
  const handleUpdateProductImage = (productId: string, newImage: string) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, image: newImage } : p));
    setProducts(updated);
    safeLocalStorageSet('eshabuy_products_list', updated);
    const targetProd = updated.find((p) => p.id === productId);
    if (targetProd) {
      saveProductToFirestore(targetProd).catch((err) =>
        console.warn('Product image saved locally, Firestore sync pending:', err)
      );
    }
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct({ ...selectedProduct, image: newImage });
    }
    showToast('Product picture updated & synced to Firebase!');
  };

  // Admin: Update Order Status
  const handleAdminUpdateOrderStatus = (orderId: string, newStatus: CustomerOrder['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    safeLocalStorageSet('eshabuy_orders_list', updated);
    // Sync order update to Firestore
    updateOrderStatusInFirestore(orderId, newStatus).catch((err) =>
      console.warn('Order status saved locally, Firestore sync pending:', err)
    );
    showToast(`Order #${orderId} status set to "${newStatus}"`);
  };

  // Push / Backup entire catalog and settings to Firebase
  const handleSyncAllToFirebase = async () => {
    setIsFirebaseSyncing(true);
    try {
      await saveSiteSettingsToFirestore(siteSettings);
      for (const prod of products) {
        await saveProductToFirestore(prod);
      }
      for (const ord of orders) {
        await saveOrderToFirestore(ord);
      }
      showToast('All products, settings & orders successfully synced to Firebase!');
    } catch (err) {
      console.error('Manual sync failed:', err);
      showToast('Firebase sync completed with local fallback.');
    } finally {
      setIsFirebaseSyncing(false);
    }
  };

  // Admin: Reset to Factory Defaults
  const handleAdminResetDefaults = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setProducts(PRODUCTS);
    setOrders(INITIAL_ORDERS);
    try {
      localStorage.removeItem('eshabuy_site_settings');
      localStorage.removeItem('eshabuy_store_name');
      localStorage.removeItem('eshabuy_products_list');
      localStorage.removeItem('eshabuy_orders_list');
    } catch {
      // ignore
    }
    document.title = `${DEFAULT_SITE_SETTINGS.storeName} | ${DEFAULT_SITE_SETTINGS.storeTagline}`;
    showToast('All settings reset to factory defaults.');
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
        announcementText={siteSettings.announcementText}
        promoCode={siteSettings.promoCode}
        discountPercent={siteSettings.promoDiscountPercent}
        onOpenPromo={() => {
          handleApplyPromo(siteSettings.promoCode);
          setIsCartOpen(true);
        }}
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Sticky Header */}
      <Header
        storeName={siteSettings.storeName}
        logoType={siteSettings.logoType}
        logoImageUrl={siteSettings.logoImageUrl}
        logoBadgeInitial={siteSettings.logoBadgeInitial}
        logoHeight={siteSettings.logoHeight}
        cartCount={cartTotalCount}
        wishlistCount={wishlist.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenRename={() => setIsRenameModalOpen(true)}
      />

      <main className="flex-1">
        {/* Compact Hero Banner */}
        <Hero
          badge={siteSettings.heroBadge}
          headline={siteSettings.heroHeadline}
          highlight={siteSettings.heroHighlight}
          description={siteSettings.heroDescription}
          image1={siteSettings.heroImage1}
          image2={siteSettings.heroImage2}
          statSold={siteSettings.heroStatSold}
          statRating={siteSettings.heroStatRating}
          statDispatch={siteSettings.heroStatDispatch}
          onExploreCatalog={scrollToCatalog}
          onViewFlashSale={scrollToFlashSale}
        />

        {/* Quick Categories Bar */}
        <QuickCategories onSelectCategory={handleSelectCategory} />

        {/* New Arrivals Section */}
        <NewArrivals
          products={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onOpenModal={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p)}
          onBrowseCatalog={scrollToCatalog}
        />

        {/* Compact Flash Sale & Limited Edition Banner */}
        <FlashSale
          title={siteSettings.flashSaleTitle}
          discountText={siteSettings.flashSaleDiscount}
          subtitle={siteSettings.flashSaleSubtitle}
          onAddDealToCart={handleAddDealToCart}
        />

        {/* Main Product Catalog with Filter Tabs */}
        <Catalog
          products={products}
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onOpenModal={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p)}
        />

        {/* Why Us / Value Proposition */}
        <WhyUs />
      </main>

      {/* Footer (Clicking © opens the Admin Panel with id: es123, pass: es123) */}
      <Footer
        storeName={siteSettings.storeName}
        onNewsletterSubscribe={handleNewsletter}
        onFilterCategory={handleSelectCategory}
        onOpenAdmin={() => setIsAdminOpen(true)}
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
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Quick View Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onUpdateProductImage={handleUpdateProductImage}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
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

      {/* Rename App & Logo Customizer Modal */}
      <RenameAppModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        settings={siteSettings}
        onSave={handleUpdateStoreBranding}
      />

      {/* FULL ADMIN PANEL MODAL (Triggered by clicking © in footer with id/pass es123) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={siteSettings}
        onSaveSettings={handleAdminSaveSettings}
        products={products}
        onSaveProducts={handleAdminSaveProducts}
        orders={orders}
        onUpdateOrderStatus={handleAdminUpdateOrderStatus}
        onResetDefaults={handleAdminResetDefaults}
        onSyncAllToFirebase={handleSyncAllToFirebase}
        isFirebaseSyncing={isFirebaseSyncing}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
