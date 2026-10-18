import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { ImagePickerField } from './ImagePickerField';

interface RenameAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onSave: (updates: Partial<SiteSettings>) => void;
}

export const RenameAppModal: React.FC<RenameAppModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [storeName, setStoreName] = useState(settings.storeName);
  const [logoType, setLogoType] = useState<'badge' | 'image'>(settings.logoType || 'badge');
  const [logoBadgeInitial, setLogoBadgeInitial] = useState(
    settings.logoBadgeInitial || settings.storeName.charAt(0) || 'E'
  );
  const [logoImageUrl, setLogoImageUrl] = useState(settings.logoImageUrl || '');
  const [logoHeight, setLogoHeight] = useState(settings.logoHeight || 36);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    onSave({
      storeName: storeName.trim(),
      logoType,
      logoBadgeInitial: logoBadgeInitial.trim().toUpperCase() || storeName.trim().charAt(0).toUpperCase(),
      logoImageUrl,
      logoHeight
    });
    onClose();
  };

  const namePresets = [
    'EshaBuy',
    'LuxeVibe',
    'UrbanKulture',
    'ModaExpress',
    'GhorerBazar',
    'NovaStyle'
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5 sm:p-6 relative border border-slate-100 my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">
              <i className="fa-solid fa-paintbrush"></i>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Customize Logo & Store Name</h4>
              <p className="text-[11px] text-slate-400">Update branding, upload image logo, or optimize on device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Header Preview
            </span>
            <div className="flex items-center gap-2">
              {logoType === 'image' && logoImageUrl ? (
                <img
                  src={logoImageUrl}
                  alt="Custom Logo"
                  style={{ height: `${logoHeight}px` }}
                  className="w-auto max-w-[140px] object-contain rounded"
                />
              ) : (
                <div className="bg-sky-600 text-white font-extrabold text-lg px-2.5 py-0.5 rounded-xl shadow-xs transform -rotate-2">
                  {logoBadgeInitial || storeName.charAt(0) || 'E'}
                </div>
              )}
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                {storeName || 'Store Name'}
              </span>
            </div>
          </div>
          <span className="text-[11px] bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded">
            Live Preview
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Store Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Store / App Brand Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. EshaBuy, GhorerBazar, MyBrand"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full text-sm font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {namePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setStoreName(preset)}
                  className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Format Selection */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Logo Presentation
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="modalLogoType"
                  checked={logoType === 'badge'}
                  onChange={() => setLogoType('badge')}
                  className="accent-sky-600"
                />
                <span>Icon Letter Badge</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="modalLogoType"
                  checked={logoType === 'image'}
                  onChange={() => setLogoType('image')}
                  className="accent-sky-600"
                />
                <span>Custom Logo Image</span>
              </label>
            </div>

            {logoType === 'badge' ? (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Badge Initial Symbol (1-3 letters)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={logoBadgeInitial}
                  onChange={(e) => setLogoBadgeInitial(e.target.value.toUpperCase())}
                  className="w-20 text-xs font-bold p-2 text-center bg-white border border-slate-200 rounded-lg uppercase"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <ImagePickerField
                  label="Logo Graphic"
                  value={logoImageUrl}
                  onChange={(url) => {
                    setLogoImageUrl(url);
                    setLogoType('image');
                  }}
                  presetCategory="logo"
                  presetTarget="logo"
                  helpText="Upload from your device or pick a curated logo. Click 'Optimize & Edit' for live compression studio."
                  recommendedAspect="Square 1:1 or Horizontal (PNG/SVG/WebP)"
                />

                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Header Logo Height</span>
                    <span className="font-mono text-sky-600 font-bold">{logoHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="56"
                    step="2"
                    value={logoHeight}
                    onChange={(e) => setLogoHeight(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              Save Branding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
