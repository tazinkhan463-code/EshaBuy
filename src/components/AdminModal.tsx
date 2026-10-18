import React, { useState, useEffect } from 'react';
import { SiteSettings, Product, CustomerOrder } from '../types';
import { ImagePickerField } from './ImagePickerField';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onSaveSettings: (newSettings: SiteSettings) => void;
  products: Product[];
  onSaveProducts: (newProducts: Product[]) => void;
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: CustomerOrder['status']) => void;
  onResetDefaults: () => void;
  onSyncAllToFirebase?: () => Promise<void>;
  isFirebaseSyncing?: boolean;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  products,
  onSaveProducts,
  orders,
  onUpdateOrderStatus,
  onResetDefaults,
  onSyncAllToFirebase,
  isFirebaseSyncing
}) => {
  // Authentication State (id: es123, pass: es123)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminIdInput, setAdminIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'products' | 'flash' | 'orders' | 'contact' | 'firebase'>('branding');

  // Local Form State for Settings
  const [formSettings, setFormSettings] = useState<SiteSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setFormSettings(settings);
    }
  }, [isOpen, settings]);

  // Product Editing State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'Tops & Dresses',
    price: 49.99,
    oldPrice: 69.99,
    badge: 'NEW',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    description: 'High quality modern fashion apparel crafted for everyday elegance.',
    sizes: ['S', 'M', 'L', 'XL']
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = adminIdInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // ID pass hobe es123
    if ((cleanId === 'es123' || cleanId === 'admin') && cleanPass === 'es123') {
      setIsAuthenticated(true);
      setAuthError('');
      setFormSettings(settings);
    } else {
      setAuthError('Invalid credentials! Required ID: es123 and Password: es123');
    }
  };

  const handleQuickDemoFill = () => {
    setAdminIdInput('es123');
    setPasswordInput('es123');
    setAuthError('');
  };

  const handleSaveAllSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formSettings);
    onClose();
  };

  // Product Handlers
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProduct) {
      // Update existing
      const updated = products.map((p) =>
        p.id === editingProduct.id ? ({ ...p, ...productForm } as Product) : p
      );
      onSaveProducts(updated);
      setEditingProduct(null);
    } else {
      // Add new
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productForm.name || 'New Fashion Item',
        category: productForm.category as any || 'Tops & Dresses',
        price: Number(productForm.price) || 29.99,
        oldPrice: Number(productForm.oldPrice) || 39.99,
        badge: (productForm.badge as any) || 'NEW',
        rating: productForm.rating || '5.0',
        image: productForm.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
        description: productForm.description || '',
        sizes: productForm.sizes || ['S', 'M', 'L']
      };
      onSaveProducts([newProduct, ...products]);
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter((p) => p.id !== productId);
      onSaveProducts(updated);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white text-sm font-bold shadow-xs">
              <i className="fa-solid fa-screwdriver-wrench"></i>
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Store Admin Panel <span className="text-xs text-amber-400 font-mono font-normal ml-1">v2.4</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Full Store Management, Logo Customizer & Live Controls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <i className="fa-solid fa-right-from-bracket mr-1"></i> Logout
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close admin panel"
              className="text-slate-400 hover:text-white p-1 text-lg"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* AUTHENTICATION VIEW */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto w-full text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center text-2xl shadow-inner border border-sky-100">
              <i className="fa-solid fa-shield-halved"></i>
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-900">Admin Authentication</h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter your administrative credentials to access store controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin User ID
                </label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-3 top-3 text-slate-400 text-xs"></i>
                  <input
                    type="text"
                    required
                    placeholder="Enter ID (es123)"
                    value={adminIdInput}
                    onChange={(e) => setAdminIdInput(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3 top-3 text-slate-400 text-xs"></i>
                  <input
                    type="password"
                    required
                    placeholder="Enter Password (es123)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono text-slate-800"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-medium flex items-center gap-1.5">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>{authError}</span>
                </div>
              )}

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center justify-between">
                <span>Default credentials: <strong>es123</strong></span>
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="bg-amber-200/80 hover:bg-amber-300 px-2 py-0.5 rounded font-bold transition-colors"
                >
                  Quick Fill (es123)
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold py-3 rounded-xl shadow-md text-xs uppercase tracking-wider transition-all"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-slate-50 border-r border-slate-200 p-3 space-y-1 overflow-x-auto md:overflow-y-auto flex md:flex-col shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('branding')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  activeTab === 'branding'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <i className="fa-solid fa-paintbrush w-4"></i>
                <span>Logo & Branding</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  activeTab === 'hero'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <i className="fa-solid fa-image w-4"></i>
                <span>Hero & Banners</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <i className="fa-solid fa-shirt w-4"></i>
                <span>Products ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('flash')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  activeTab === 'flash'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <i className="fa-solid fa-bolt text-amber-500 w-4"></i>
                <span>Flash Sale Offers</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <i className="fa-solid fa-boxes-packing w-4"></i>
                <span>Orders ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  activeTab === 'contact'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <i className="fa-solid fa-phone w-4"></i>
                <span>Contact & Footer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('firebase')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  activeTab === 'firebase'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <i className="fa-solid fa-fire text-amber-500 w-4"></i>
                <span className="flex-1 flex items-center justify-between">
                  <span>Firebase DB</span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                </span>
              </button>
            </div>

            {/* Dashboard Content Area */}
            <div className="flex-1 p-5 overflow-y-auto max-h-[calc(92vh-130px)]">
              {/* TAB 1: LOGO & BRANDING */}
              {activeTab === 'branding' && (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Store Branding & Logo Settings
                    </h4>
                    <p className="text-xs text-slate-500">
                      Customize your store name, logo type (initial icon vs custom image URL), header, and promotions.
                    </p>
                  </div>

                  {/* Live Logo Preview Box */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Current Header Logo Preview
                      </span>
                      <div className="flex items-center gap-2.5">
                        {formSettings.logoType === 'image' && formSettings.logoImageUrl ? (
                          <img
                            src={formSettings.logoImageUrl}
                            alt="Custom Logo"
                            style={{ height: `${formSettings.logoHeight || 36}px` }}
                            className="w-auto max-w-[140px] object-contain rounded"
                          />
                        ) : (
                          <div className="bg-sky-600 text-white font-extrabold text-lg px-2.5 py-0.5 rounded-xl shadow-xs transform -rotate-2">
                            {formSettings.logoBadgeInitial || formSettings.storeName.charAt(0) || 'E'}
                          </div>
                        )}
                        <span className="font-extrabold text-xl tracking-tight text-slate-900">
                          {formSettings.storeName}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-md">
                      Live Synchronized
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={formSettings.storeName}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, storeName: e.target.value })
                        }
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Store Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        value={formSettings.storeTagline}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, storeTagline: e.target.value })
                        }
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Logo Options */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      Logo Display Format
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="logoType"
                          checked={formSettings.logoType === 'badge'}
                          onChange={() => setFormSettings({ ...formSettings, logoType: 'badge' })}
                          className="accent-sky-600"
                        />
                        <span>Icon Initial Badge (e.g. "E")</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="logoType"
                          checked={formSettings.logoType === 'image'}
                          onChange={() => setFormSettings({ ...formSettings, logoType: 'image' })}
                          className="accent-sky-600"
                        />
                        <span>Custom Logo Image URL / Upload</span>
                      </label>
                    </div>

                    {formSettings.logoType === 'badge' ? (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Badge Letter / Symbol
                        </label>
                        <input
                          type="text"
                          maxLength={3}
                          value={formSettings.logoBadgeInitial}
                          onChange={(e) =>
                            setFormSettings({ ...formSettings, logoBadgeInitial: e.target.value.toUpperCase() })
                          }
                          className="w-24 text-xs font-bold p-2 text-center bg-white border border-slate-200 rounded-lg uppercase"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3 pt-1">
                        <ImagePickerField
                          label="Custom Logo Image"
                          value={formSettings.logoImageUrl}
                          onChange={(url) =>
                            setFormSettings({ ...formSettings, logoImageUrl: url, logoType: 'image' })
                          }
                          presetCategory="logo"
                          presetTarget="logo"
                          helpText="Upload a logo from your device (PNG/SVG/WebP) or pick from curated logo presets. Opens the Optimizer Studio for instant cropping & compression."
                          recommendedAspect="Square 1:1 or Horizontal Logo (PNG/SVG)"
                        />

                        <div>
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                            <span>Navigation Bar Logo Height</span>
                            <span className="font-mono text-sky-600 font-bold">{formSettings.logoHeight || 36}px</span>
                          </div>
                          <input
                            type="range"
                            min="24"
                            max="56"
                            step="2"
                            value={formSettings.logoHeight || 36}
                            onChange={(e) =>
                              setFormSettings({ ...formSettings, logoHeight: Number(e.target.value) })
                            }
                            className="w-full accent-sky-600 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Announcement & Promo Discount */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Top Announcement Bar Text
                      </label>
                      <input
                        type="text"
                        value={formSettings.announcementText}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, announcementText: e.target.value })
                        }
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Promo Voucher Code
                      </label>
                      <input
                        type="text"
                        value={formSettings.promoCode}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, promoCode: e.target.value.toUpperCase() })
                        }
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Promo Discount Rate (%)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={formSettings.promoDiscountPercent}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            promoDiscountPercent: Number(e.target.value) || 20
                          })
                        }
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Free Express Delivery Threshold ($)
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={formSettings.freeShippingThreshold}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            freeShippingThreshold: Number(e.target.value) || 75
                          })
                        }
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HERO & BANNERS */}
              {activeTab === 'hero' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Hero Section Content & Visuals
                    </h4>
                    <p className="text-xs text-slate-500">
                      Edit the main homepage banner headlines, cursive highlights, and dual showcase photos.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Top Dropped Pill Text
                      </label>
                      <input
                        type="text"
                        value={formSettings.heroBadge}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, heroBadge: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Main Headline Start
                      </label>
                      <input
                        type="text"
                        value={formSettings.heroHeadline}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, heroHeadline: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cursive Highlight Text (Caveat Font)
                      </label>
                      <input
                        type="text"
                        value={formSettings.heroHighlight}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, heroHighlight: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-amber-600 font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hero Description Prose
                      </label>
                      <textarea
                        rows={2}
                        value={formSettings.heroDescription}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, heroDescription: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Dual Hero Images */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <ImagePickerField
                      label="Hero Card 1 (Women's Apparel)"
                      value={formSettings.heroImage1}
                      onChange={(url) => setFormSettings({ ...formSettings, heroImage1: url })}
                      presetCategory="apparel"
                      presetTarget="hero"
                      helpText="Upload a high-fashion photo or select from curated presets. Opens the Optimizer Studio for instant cropping & compression."
                      recommendedAspect="Portrait 3:4"
                    />

                    <ImagePickerField
                      label="Hero Card 2 (Footwear Edition)"
                      value={formSettings.heroImage2}
                      onChange={(url) => setFormSettings({ ...formSettings, heroImage2: url })}
                      presetCategory="footwear"
                      presetTarget="hero"
                      helpText="Upload a sneaker/shoe photo or select from curated presets. Opens the Optimizer Studio for instant cropping & compression."
                      recommendedAspect="Portrait 3:4"
                    />
                  </div>

                  {/* Trust Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Stat 1 (Products Sold)
                      </label>
                      <input
                        type="text"
                        value={formSettings.heroStatSold}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, heroStatSold: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Stat 2 (Rating)
                      </label>
                      <input
                        type="text"
                        value={formSettings.heroStatRating}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, heroStatRating: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Stat 3 (Dispatch Time)
                      </label>
                      <input
                        type="text"
                        value={formSettings.heroStatDispatch}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, heroStatDispatch: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCTS MANAGEMENT (CRUD) */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">
                        Product Catalog Inventory
                      </h4>
                      <p className="text-xs text-slate-500">
                        Add, edit, modify pricing, badges, images, or remove items.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({
                          name: '',
                          category: 'Tops & Dresses',
                          price: 49.99,
                          oldPrice: 69.99,
                          badge: 'NEW',
                          rating: '5.0',
                          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
                          description: 'High quality modern fashion apparel crafted for everyday elegance.',
                          sizes: ['S', 'M', 'L', 'XL']
                        });
                        setIsAddingProduct(true);
                      }}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Add New Product</span>
                    </button>
                  </div>

                  {/* Add / Edit Form Modal inside */}
                  {(isAddingProduct || editingProduct) && (
                    <form
                      onSubmit={handleSaveProductForm}
                      className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-3"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-sky-200">
                        <h5 className="font-extrabold text-xs text-sky-900">
                          {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Product to Store'}
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingProduct(false);
                            setEditingProduct(null);
                          }}
                          className="text-slate-400 hover:text-slate-600 text-sm"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Category *
                          </label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                          >
                            <option value="Tops & Dresses">Tops & Dresses</option>
                            <option value="Outerwear">Outerwear</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Bags & Accessories">Bags & Accessories</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Sale Price ($) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Original Price ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.oldPrice}
                            onChange={(e) => setProductForm({ ...productForm, oldPrice: Number(e.target.value) })}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Badge Tag
                          </label>
                          <select
                            value={productForm.badge}
                            onChange={(e) => setProductForm({ ...productForm, badge: e.target.value as any })}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                          >
                            <option value="NEW">NEW</option>
                            <option value="HOT">HOT</option>
                            <option value="SALE">SALE</option>
                            <option value="BEST">BEST</option>
                            <option value="TRENDING">TRENDING</option>
                            <option value="LIMITED">LIMITED</option>
                          </select>
                        </div>

                        <div className="sm:col-span-3">
                          <ImagePickerField
                            label="Product Picture & Presentation *"
                            value={productForm.image || ''}
                            onChange={(url) => setProductForm({ ...productForm, image: url })}
                            presetCategory={
                              productForm.category === 'Footwear'
                                ? 'footwear'
                                : productForm.category === 'Outerwear'
                                ? 'outerwear'
                                : productForm.category === 'Bags & Accessories'
                                ? 'bags'
                                : 'apparel'
                            }
                            presetTarget="product"
                            helpText="Upload a product photo directly from your device, tune in the Optimizer Studio (crop to 3:4 or 1:1, compress & boost colors), or pick curated catalog presets."
                            recommendedAspect="Portrait 3:4 (Recommended) or Square 1:1"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingProduct(false);
                            setEditingProduct(null);
                          }}
                          className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs"
                        >
                          {editingProduct ? 'Save Product Changes' : 'Add to Catalog'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Products Table List */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs divide-y divide-slate-200">
                      <thead className="bg-slate-100 text-slate-700 font-bold">
                        <tr>
                          <th className="p-2.5">Item & Photo</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5">Price</th>
                          <th className="p-2.5">Badge</th>
                          <th className="p-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-2.5 flex items-center gap-2.5">
                              <div
                                className="relative group/thumb shrink-0 cursor-pointer"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm(p);
                                  setIsAddingProduct(false);
                                }}
                                title="Click to edit and optimize photo"
                              >
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-11 h-11 object-cover rounded-lg bg-slate-100 border border-slate-200"
                                />
                                <div className="absolute inset-0 bg-slate-900/60 text-white rounded-lg opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-xs">
                                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                                </div>
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate max-w-[160px] sm:max-w-xs">{p.name}</p>
                                <span className="text-[10px] text-amber-500 font-bold">★ {p.rating}</span>
                              </div>
                            </td>
                            <td className="p-2.5 text-slate-600">{p.category}</td>
                            <td className="p-2.5 font-bold text-sky-600 tabular-numbers">
                              ${p.price.toFixed(2)}
                            </td>
                            <td className="p-2.5">
                              <span className="bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                                {p.badge}
                              </span>
                            </td>
                            <td className="p-2.5 text-right space-x-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm(p);
                                  setIsAddingProduct(false);
                                }}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md"
                                title="Edit & Optimize Photo"
                              >
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm(p);
                                  setIsAddingProduct(false);
                                }}
                                className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-md"
                                title="Edit product details"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                                title="Delete product"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: FLASH SALE */}
              {activeTab === 'flash' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">Flash Sale Settings</h4>
                    <p className="text-xs text-slate-500">
                      Configure the red countdown banner and promotion percentages.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sale Banner Heading
                      </label>
                      <input
                        type="text"
                        value={formSettings.flashSaleTitle}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, flashSaleTitle: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Discount Highlight (Yellow Tag)
                      </label>
                      <input
                        type="text"
                        value={formSettings.flashSaleDiscount}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, flashSaleDiscount: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-red-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Flash Sale Subtitle Notice
                      </label>
                      <input
                        type="text"
                        value={formSettings.flashSaleSubtitle}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, flashSaleSubtitle: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Customer Orders Management
                    </h4>
                    <p className="text-xs text-slate-500">
                      View recent customer checkouts, shipping addresses, items purchased, and update shipment status.
                    </p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <i className="fa-solid fa-box-open text-3xl mb-2"></i>
                      <p className="text-xs font-bold text-slate-700">No orders placed yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                {order.id}
                              </span>
                              <span className="text-slate-400">· {order.date}</span>
                              <span className="font-semibold text-slate-700">by {order.customerName}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-500">Status:</span>
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  onUpdateOrderStatus(order.id, e.target.value as any)
                                }
                                className="bg-sky-50 text-sky-800 font-bold border border-sky-200 rounded px-2 py-1 text-xs focus:outline-none"
                              >
                                <option value="Packed & Inspected">Packed & Inspected</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                            <div>
                              <p className="text-[11px]">
                                <strong>Address:</strong> {order.address}, {order.city}
                              </p>
                              <p className="text-[11px]">
                                <strong>Email:</strong> {order.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px]">
                                <strong>Payment:</strong> {order.paymentMethod}
                              </p>
                              <p className="text-[11px]">
                                <strong>Grand Total:</strong>{' '}
                                <span className="font-bold text-sky-600">${order.grandTotal.toFixed(2)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-50">
                            <strong>Items:</strong>{' '}
                            {order.items.map((it) => `${it.name} (Qty: ${it.quantity})`).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: CONTACT & FOOTER */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Contact Information & Footer Details
                    </h4>
                    <p className="text-xs text-slate-500">
                      Update your official support email, hotline phone number, and headquarters address.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Support Email Address
                      </label>
                      <input
                        type="email"
                        value={formSettings.supportEmail}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, supportEmail: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Customer Hotline Phone
                      </label>
                      <input
                        type="text"
                        value={formSettings.supportPhone}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, supportPhone: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Headquarters Office Address
                      </label>
                      <input
                        type="text"
                        value={formSettings.address}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, address: e.target.value })
                        }
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: FIREBASE CLOUD DATABASE */}
              {activeTab === 'firebase' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-slate-900">
                          Firebase Cloud Database
                        </h4>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Connected
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Real-time persistent synchronization powered by Google Firebase Firestore.
                      </p>
                    </div>

                    {onSyncAllToFirebase && (
                      <button
                        type="button"
                        disabled={isFirebaseSyncing}
                        onClick={() => onSyncAllToFirebase()}
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start disabled:opacity-50"
                      >
                        <i className={`fa-solid ${isFirebaseSyncing ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'}`}></i>
                        <span>{isFirebaseSyncing ? 'Syncing to Firebase...' : 'Push All Data to Firebase'}</span>
                      </button>
                    )}
                  </div>

                  {/* Firebase Config Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Firebase Project ID</p>
                      <p className="text-sm font-black text-slate-900 mt-1 font-mono">eshabuy-7917a</p>
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Active Cloud Database</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Synced Collections</p>
                      <p className="text-sm font-black text-slate-900 mt-1">3 Collections</p>
                      <span className="text-[10px] text-slate-500 mt-1 inline-block">products, settings, orders</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Real-time Listeners</p>
                      <p className="text-sm font-black text-emerald-600 mt-1 flex items-center gap-1.5">
                        <i className="fa-solid fa-bolt text-amber-500"></i>
                        Live Active
                      </p>
                      <span className="text-[10px] text-slate-500 mt-1 inline-block">Instant multi-device sync</span>
                    </div>
                  </div>

                  {/* Collections Breakdown */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Firestore Collections Status</h5>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <div className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">
                            <i className="fa-solid fa-shirt"></i>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 font-mono">/products</p>
                            <p className="text-[11px] text-slate-500">Store Catalog items, prices, discounts & photos</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                          {products.length} Products Synced
                        </span>
                      </div>

                      <div className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">
                            <i className="fa-solid fa-sliders"></i>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 font-mono">/settings/general</p>
                            <p className="text-[11px] text-slate-500">Store branding, logo image, header & hero banners</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                          1 Configuration Doc
                        </span>
                      </div>

                      <div className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                            <i className="fa-solid fa-boxes-packing"></i>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 font-mono">/orders</p>
                            <p className="text-[11px] text-slate-500">Customer transactions, checkout items & delivery status</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                          {orders.length} Orders Synced
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informational Notice */}
                  <div className="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-start gap-3">
                    <i className="fa-solid fa-circle-info text-amber-600 mt-0.5 text-sm"></i>
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <strong>How Firebase Sync Works:</strong> Whenever you edit products, upload photos, change the logo, update store settings, or whenever a shopper places an order, the changes are automatically saved directly to your <strong>eshabuy-7917a</strong> Firebase Firestore database and synced live to all visitors.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Save Action Bar */}
        {isAuthenticated && (
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all store settings to default factory values?')) {
                  onResetDefaults();
                  onClose();
                }
              }}
              className="text-xs text-slate-500 hover:text-red-600 font-semibold px-2 py-1 transition-colors"
            >
              <i className="fa-solid fa-rotate-left mr-1"></i> Reset to Factory Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAllSettings}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <i className="fa-solid fa-check text-xs"></i>
                <span>Save & Apply Changes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
