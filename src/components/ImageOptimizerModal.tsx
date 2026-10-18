import React, { useState, useEffect, useRef } from 'react';
import {
  optimizeImage,
  OptimizeOptions,
  OptimizeResult,
  DEFAULT_OPTIMIZE_OPTIONS,
  formatBytes
} from '../utils/imageOptimizer';

interface ImageOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImage: string;
  imageTitle?: string;
  presetTarget?: 'logo' | 'product' | 'hero' | 'general';
  onApply: (optimizedDataUrl: string) => void;
}

export const ImageOptimizerModal: React.FC<ImageOptimizerModalProps> = ({
  isOpen,
  onClose,
  initialImage,
  imageTitle = 'Image Optimizer Studio',
  presetTarget = 'general',
  onApply
}) => {
  const [options, setOptions] = useState<OptimizeOptions>(() => {
    if (presetTarget === 'logo') {
      return {
        maxDimension: 260,
        quality: 0.90,
        format: 'image/png',
        aspectRatio: 'natural',
        brightness: 0,
        contrast: 0,
        saturation: 100
      };
    }
    if (presetTarget === 'product') {
      return {
        maxDimension: 600,
        quality: 0.82,
        format: 'image/webp',
        aspectRatio: '3:4',
        brightness: 2,
        contrast: 5,
        saturation: 105
      };
    }
    if (presetTarget === 'hero') {
      return {
        maxDimension: 900,
        quality: 0.84,
        format: 'image/webp',
        aspectRatio: '3:4',
        brightness: 0,
        contrast: 0,
        saturation: 100
      };
    }
    return DEFAULT_OPTIMIZE_OPTIONS;
  });

  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCheckerboard, setShowCheckerboard] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Recalculate on option changes
  useEffect(() => {
    if (!isOpen || !initialImage) return;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        setIsProcessing(true);
        setErrorMessage('');
        const res = await optimizeImage(initialImage, options);
        setResult(res);
      } catch (err: any) {
        console.error('Image optimization failed', err);
        setErrorMessage('Failed to optimize this image source. Try a different format or URL.');
      } finally {
        setIsProcessing(false);
      }
    }, 120);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [isOpen, initialImage, options]);

  if (!isOpen || !initialImage) return null;

  const handleApply = () => {
    if (result && result.dataUrl) {
      onApply(result.dataUrl);
    } else {
      onApply(initialImage);
    }
    onClose();
  };

  const applyQuickPreset = (type: 'logo' | 'product_square' | 'product_fashion' | 'hero' | 'ultra_speed') => {
    switch (type) {
      case 'logo':
        setOptions({
          maxDimension: 240,
          quality: 0.90,
          format: 'image/png',
          aspectRatio: 'natural',
          brightness: 0,
          contrast: 0,
          saturation: 100
        });
        break;
      case 'product_square':
        setOptions({
          maxDimension: 550,
          quality: 0.82,
          format: 'image/webp',
          aspectRatio: '1:1',
          brightness: 2,
          contrast: 4,
          saturation: 105
        });
        break;
      case 'product_fashion':
        setOptions({
          maxDimension: 600,
          quality: 0.82,
          format: 'image/webp',
          aspectRatio: '3:4',
          brightness: 2,
          contrast: 5,
          saturation: 105
        });
        break;
      case 'hero':
        setOptions({
          maxDimension: 900,
          quality: 0.85,
          format: 'image/webp',
          aspectRatio: '16:9',
          brightness: 0,
          contrast: 0,
          saturation: 100
        });
        break;
      case 'ultra_speed':
        setOptions({
          maxDimension: 400,
          quality: 0.65,
          format: 'image/webp',
          aspectRatio: 'natural',
          brightness: 0,
          contrast: 0,
          saturation: 100
        });
        break;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-xs">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                Image Optimizer Studio
              </h3>
              <p className="text-[11px] text-slate-400">
                {imageTitle} · Resize, Compress & Enhance for Ultra-Fast Loading
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-lg transition-colors"
            aria-label="Close optimizer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content Body: Two Columns */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
          {/* Left: Live Visual Preview */}
          <div className="lg:w-1/2 p-5 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-eye text-sky-600"></i> Live Output Preview
                </span>
                <button
                  type="button"
                  onClick={() => setShowCheckerboard(!showCheckerboard)}
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors border ${
                    showCheckerboard
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                  title="Toggle checkerboard background for PNG/transparent logos"
                >
                  <i className="fa-solid fa-chess-board mr-1"></i> Transparency Grid
                </button>
              </div>

              {/* Preview Window */}
              <div
                className={`relative w-full h-64 sm:h-80 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center transition-all ${
                  showCheckerboard
                    ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] bg-slate-100'
                    : 'bg-slate-200/50'
                }`}
              >
                {isProcessing && (
                  <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white text-xs font-bold gap-2">
                    <i className="fa-solid fa-spinner fa-spin text-xl text-emerald-400"></i>
                    <span>Optimizing & Compressing...</span>
                  </div>
                )}

                {errorMessage ? (
                  <div className="p-4 text-center text-red-500 text-xs font-medium">
                    <i className="fa-solid fa-circle-exclamation text-xl mb-1.5 block"></i>
                    {errorMessage}
                  </div>
                ) : result?.dataUrl ? (
                  <img
                    src={result.dataUrl}
                    alt="Optimized preview"
                    className="max-w-full max-h-full object-contain shadow-xs rounded"
                  />
                ) : (
                  <img
                    src={initialImage}
                    alt="Initial preview"
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
            </div>

            {/* Performance Stats Panel */}
            {result && (
              <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Compression Efficiency</span>
                  {result.savedPercent > 0 ? (
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ⚡ -{result.savedPercent}% Smaller!
                    </span>
                  ) : (
                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Optimized for Web
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Output Size</span>
                    <span className="text-xs font-black text-slate-900 font-mono">
                      {formatBytes(result.optimizedBytes)}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Resolution</span>
                    <span className="text-xs font-black text-slate-900 font-mono">
                      {result.width} × {result.height}px
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Format</span>
                    <span className="text-xs font-black text-sky-700 uppercase font-mono">
                      {result.format.replace('image/', '')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Controls & Presets */}
          <div className="lg:w-1/2 p-5 space-y-4 overflow-y-auto">
            {/* Quick Profile Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                ⚡ Quick Optimization Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyQuickPreset('product_fashion')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 text-left transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-shirt text-xs text-sky-600"></i>
                  <span>Product (3:4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('product_square')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 text-left transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-square text-xs text-amber-500"></i>
                  <span>Square (1:1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('logo')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 text-left transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-crown text-xs text-purple-600"></i>
                  <span>Logo / Icon</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('hero')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 text-left transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-image text-xs text-emerald-600"></i>
                  <span>Hero Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickPreset('ultra_speed')}
                  className="col-span-2 sm:col-span-2 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-200 text-left transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-gauge-high text-xs text-amber-600"></i>
                  <span>Ultra-Light Speed (65% Compression)</span>
                </button>
              </div>
            </div>

            {/* Aspect Ratio Cropping */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Aspect Ratio Crop
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  {options.aspectRatio}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'natural', label: 'Natural' },
                  { id: '1:1', label: '1:1 Square' },
                  { id: '3:4', label: '3:4 Fashion' },
                  { id: '4:3', label: '4:3 Standard' },
                  { id: '16:9', label: '16:9 Banner' }
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setOptions({ ...options, aspectRatio: ratio.id as any })}
                    className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all ${
                      options.aspectRatio === ratio.id
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension Limit Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Maximum Dimension: <span className="text-sky-600 font-mono">{options.maxDimension}px</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {options.maxDimension! <= 300 ? 'Icons & Logos' : options.maxDimension! <= 700 ? 'Product Showcase' : 'Hero Banners'}
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="1200"
                step="50"
                value={options.maxDimension}
                onChange={(e) => setOptions({ ...options, maxDimension: Number(e.target.value) })}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>150px (Tiny)</span>
                <span>600px (Standard)</span>
                <span>1200px (HD)</span>
              </div>
            </div>

            {/* Quality Compression Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Compression Quality: <span className="text-emerald-600 font-mono">{Math.round((options.quality || 0.82) * 100)}%</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {options.quality! >= 0.85 ? 'High Quality' : options.quality! >= 0.7 ? 'Balanced' : 'Ultra Fast'}
                </span>
              </div>
              <input
                type="range"
                min="0.30"
                max="1.0"
                step="0.05"
                value={options.quality}
                onChange={(e) => setOptions({ ...options, quality: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>30% (High saving)</span>
                <span>80% (Recommended)</span>
                <span>100% (Crisp)</span>
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Output File Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { format: 'image/webp', label: 'WebP', desc: 'Modern & Fastest' },
                  { format: 'image/jpeg', label: 'JPEG', desc: 'Universal Photo' },
                  { format: 'image/png', label: 'PNG', desc: 'Sharp Logo / Vector' }
                ].map((f) => (
                  <button
                    key={f.format}
                    type="button"
                    onClick={() => setOptions({ ...options, format: f.format as any })}
                    className={`p-2 text-left rounded-xl border transition-all ${
                      options.format === f.format
                        ? 'bg-sky-50 border-sky-600 text-sky-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-extrabold">{f.label}</span>
                    <span className="block text-[10px] text-slate-400">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Tuning (Brightness & Saturation) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">
                🎨 Image Color & Vibrance Tuning
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Brightness</span>
                    <span className="font-mono">{options.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="2"
                    value={options.brightness}
                    onChange={(e) => setOptions({ ...options, brightness: Number(e.target.value) })}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Vibrance / Saturation</span>
                    <span className="font-mono">{options.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    step="5"
                    value={options.saturation}
                    onChange={(e) => setOptions({ ...options, saturation: Number(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOptions(DEFAULT_OPTIMIZE_OPTIONS)}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 transition-colors"
          >
            <i className="fa-solid fa-rotate-left mr-1"></i> Reset Tuning
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
              onClick={handleApply}
              disabled={isProcessing}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-check text-xs"></i>
              <span>Apply Optimized Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
