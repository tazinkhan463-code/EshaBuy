import React, { useState, useRef } from 'react';
import { optimizeImageFile } from '../utils/imageOptimizer';
import { IMAGE_PRESETS } from '../data/imagePresets';
import { ImageOptimizerModal } from './ImageOptimizerModal';

interface ImagePickerFieldProps {
  label: string;
  value: string;
  onChange: (newImageUrl: string) => void;
  presetCategory?: 'logo' | 'apparel' | 'footwear' | 'outerwear' | 'bags' | 'hero';
  presetTarget?: 'logo' | 'product' | 'hero' | 'general';
  helpText?: string;
  recommendedAspect?: string;
}

export const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  label,
  value,
  onChange,
  presetCategory,
  presetTarget = 'general',
  helpText,
  recommendedAspect = 'Square or 4:3'
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showOptimizerModal, setShowOptimizerModal] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [showUrlEditor, setShowUrlEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPresets = presetCategory
    ? IMAGE_PRESETS.filter((p) => p.category === presetCategory)
    : IMAGE_PRESETS;

  // Sync internal input when value changes and is not a long data URL
  const isDataUrl = value && value.startsWith('data:');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsOptimizing(true);
      // Auto-compress and scale to safe web dimensions according to target
      const maxDim = presetTarget === 'logo' ? 300 : presetTarget === 'hero' ? 900 : 600;
      const optimizedDataUrl = await optimizeImageFile(file, maxDim, 0.82);
      onChange(optimizedDataUrl);
    } catch (err) {
      console.error('Image optimization failed', err);
      alert('Could not process this image file. Please try another image.');
    } finally {
      setIsOptimizing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (inputUrl.trim()) {
      onChange(inputUrl.trim());
      setShowUrlEditor(false);
      setInputUrl('');
    }
  };

  return (
    <div className="space-y-2 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
      {/* Label and Aspect Ratio Badge */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800">
          {label}
        </label>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
          {recommendedAspect}
        </span>
      </div>

      {helpText && <p className="text-[11px] text-slate-500 leading-tight">{helpText}</p>}

      {/* Main Control Grid */}
      <div className="flex items-start gap-3 pt-1">
        {/* Preview Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center group">
          {value ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                <button
                  type="button"
                  onClick={() => setShowOptimizerModal(true)}
                  className="w-7 h-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center text-xs shadow-xs"
                  title="Tune & Optimize Image"
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center text-xs shadow-xs"
                  title="Remove Image"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-300 p-1">
              <i className="fa-regular fa-image text-2xl"></i>
              <span className="block text-[9px] mt-0.5 text-slate-400 font-medium">No Image</span>
            </div>
          )}

          {isOptimizing && (
            <div className="absolute inset-0 bg-slate-900/85 text-white flex flex-col items-center justify-center text-[10px] font-bold p-1 text-center">
              <i className="fa-solid fa-spinner fa-spin text-sm mb-1 text-emerald-400"></i>
              <span>Optimizing...</span>
            </div>
          )}
        </div>

        {/* Action Buttons Column */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Upload from Device */}
            <button
              type="button"
              disabled={isOptimizing}
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <i className="fa-solid fa-cloud-arrow-up text-xs"></i>
              <span>Upload Device File</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Optimize & Edit Studio Trigger */}
            {value && (
              <button
                type="button"
                onClick={() => setShowOptimizerModal(true)}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
                title="Open Image Optimizer & Compressor Studio"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                <span>Optimize & Edit</span>
              </button>
            )}

            {/* Presets Gallery Toggle */}
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <i className="fa-solid fa-images text-xs text-sky-600"></i>
              <span>{showPresets ? 'Close Presets' : 'Presets'}</span>
            </button>

            {/* Paste or Edit URL */}
            <button
              type="button"
              onClick={() => {
                setShowUrlEditor(!showUrlEditor);
                if (!isDataUrl && value) setInputUrl(value);
              }}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <i className="fa-solid fa-link text-xs text-slate-500"></i>
              <span>URL</span>
            </button>

            {/* Clear */}
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setInputUrl('');
                }}
                className="px-2 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear image"
              >
                Clear
              </button>
            )}
          </div>

          {/* URL Input Form (if toggled or if user wants to paste) */}
          {showUrlEditor && (
            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Paste direct image URL (https://...)"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-700 font-mono"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setShowUrlEditor(false)}
                className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Current Status Pill */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
            {isDataUrl ? (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <i className="fa-solid fa-circle-check text-emerald-600"></i> Optimized Device Image Attached
              </span>
            ) : value ? (
              <span className="truncate max-w-[240px] text-slate-500 font-mono">
                {value}
              </span>
            ) : (
              <span className="text-slate-400">Select preset, upload device file, or paste URL</span>
            )}

            {value && (
              <button
                type="button"
                onClick={() => setShowOptimizerModal(true)}
                className="text-emerald-600 hover:text-emerald-700 font-bold underline ml-2 shrink-0 cursor-pointer"
              >
                Launch Optimizer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preset Drawer Gallery */}
      {showPresets && (
        <div className="pt-2 border-t border-slate-100 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700">
              Click photo to select:
            </span>
            <span className="text-[10px] text-slate-400">
              {filteredPresets.length} options
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
            {filteredPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className={`relative rounded-lg overflow-hidden border aspect-square group transition-all ${
                  value === preset.url
                    ? 'ring-2 ring-sky-600 border-sky-600'
                    : 'border-slate-200 hover:border-sky-500'
                }`}
                title={preset.label}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-white text-[8px] p-0.5 truncate text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {preset.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Full-Screen Interactive Optimizer Modal */}
      {showOptimizerModal && value && (
        <ImageOptimizerModal
          isOpen={showOptimizerModal}
          onClose={() => setShowOptimizerModal(false)}
          initialImage={value}
          imageTitle={label}
          presetTarget={presetTarget}
          onApply={(optimized) => {
            onChange(optimized);
            setShowOptimizerModal(false);
          }}
        />
      )}
    </div>
  );
};
