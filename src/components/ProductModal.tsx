import React, { useState } from 'react';
import { Product } from '../types';
import { ImageOptimizerModal } from './ImageOptimizerModal';
import { optimizeImageFile } from '../utils/imageOptimizer';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
  onUpdateProductImage?: (productId: string, newImage: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onUpdateProductImage
}) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!product) return null;

  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateProductImage) return;

    try {
      setIsUploading(true);
      const optimized = await optimizeImageFile(file, 600, 0.82);
      onUpdateProductImage(product.id, optimized);
    } catch (err) {
      console.error(err);
      alert('Could not process this image file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 relative overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-xl z-10 p-1"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Image & Quick Optimize Trigger */}
          <div className="relative rounded-xl overflow-hidden h-52 sm:h-60 bg-slate-100 group">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Quick Image Tools Overlay */}
            {onUpdateProductImage && (
              <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 backdrop-blur-xs p-2 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setShowOptimizer(true)}
                  className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 px-2 py-1 rounded flex items-center gap-1 shadow-xs"
                  title="Tune & Optimize Picture"
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-[9px]"></i>
                  <span>Optimize</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-[10px] font-bold bg-sky-600 hover:bg-sky-700 px-2 py-1 rounded flex items-center gap-1 shadow-xs"
                  title="Upload new picture from device"
                >
                  <i className="fa-solid fa-camera text-[9px]"></i>
                  <span>{isUploading ? 'Saving...' : 'Replace'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleDeviceUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-sky-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-amber-500 font-bold text-xs">
                ★ {product.rating}
              </span>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h4>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex items-center gap-2 tabular-numbers">
              <span className="text-lg font-black text-sky-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700">Size:</label>
              <div className="flex gap-1.5">
                {sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`w-7 h-7 rounded-md border text-[10px] font-bold transition-all ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-sky-600'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                onAddToCart(product, selectedSize);
                onClose();
              }}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider transition-all mt-2 active:scale-98 flex items-center justify-center gap-1.5"
            >
              <i className="fa-solid fa-bag-shopping"></i>
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optimizer Studio Modal for Product */}
      {showOptimizer && onUpdateProductImage && (
        <ImageOptimizerModal
          isOpen={showOptimizer}
          onClose={() => setShowOptimizer(false)}
          initialImage={product.image}
          imageTitle={`Product: ${product.name}`}
          presetTarget="product"
          onApply={(optimized) => {
            onUpdateProductImage(product.id, optimized);
            setShowOptimizer(false);
          }}
        />
      )}
    </div>
  );
};
