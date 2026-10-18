/**
 * High-performance browser-based Image Optimizer and compression engine.
 * Supports File uploads, Data URLs, and remote URLs (with CORS fallback).
 * Provides aspect-ratio cropping, dimension scaling, quality tuning, format conversion,
 * and visual adjustments (brightness, contrast, saturation).
 */

export interface OptimizeOptions {
  maxDimension?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
  aspectRatio?: 'natural' | '1:1' | '3:4' | '4:3' | '16:9';
  brightness?: number; // -50 to 50
  contrast?: number; // -50 to 50
  saturation?: number; // 0 to 200 (100 is default)
}

export interface OptimizeResult {
  dataUrl: string;
  originalBytes: number;
  optimizedBytes: number;
  savedPercent: number;
  width: number;
  height: number;
  format: string;
}

export const DEFAULT_OPTIMIZE_OPTIONS: OptimizeOptions = {
  maxDimension: 600,
  quality: 0.82,
  format: 'image/webp',
  aspectRatio: 'natural',
  brightness: 0,
  contrast: 0,
  saturation: 100
};

/**
 * Loads an image from a File, Blob, Data URL, or Remote URL
 */
export function loadImageElement(source: File | Blob | string): Promise<{ img: HTMLImageElement; sizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    if (source instanceof File || source instanceof Blob) {
      const sizeBytes = source.size;
      const objectUrl = URL.createObjectURL(source);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ img, sizeBytes });
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image file'));
      };
      img.src = objectUrl;
    } else {
      // String source: could be data URL or remote URL
      let sizeBytes = 0;
      if (source.startsWith('data:')) {
        const base64Index = source.indexOf(',');
        if (base64Index !== -1) {
          sizeBytes = Math.round((source.length - base64Index - 1) * 0.75);
        }
      } else {
        // Estimated size for external URL if header not available
        sizeBytes = 250000;
      }

      img.onload = () => resolve({ img, sizeBytes });
      img.onerror = () => {
        // Retry without crossOrigin if CORS issues occur
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve({ img: fallbackImg, sizeBytes });
        fallbackImg.onerror = () => reject(new Error('Failed to load image from URL'));
        fallbackImg.src = source;
      };
      img.src = source;
    }
  });
}

/**
 * Optimizes an image using HTML5 Canvas
 */
export async function optimizeImage(
  source: File | Blob | string,
  options: OptimizeOptions = {}
): Promise<OptimizeResult> {
  const opts = { ...DEFAULT_OPTIMIZE_OPTIONS, ...options };
  const { img, sizeBytes: originalBytes } = await loadImageElement(source);

  const srcWidth = img.naturalWidth || img.width;
  const srcHeight = img.naturalHeight || img.height;

  // Calculate cropping for desired aspect ratio
  let cropX = 0;
  let cropY = 0;
  let cropWidth = srcWidth;
  let cropHeight = srcHeight;

  if (opts.aspectRatio && opts.aspectRatio !== 'natural') {
    let targetRatio = 1;
    if (opts.aspectRatio === '1:1') targetRatio = 1;
    else if (opts.aspectRatio === '3:4') targetRatio = 3 / 4;
    else if (opts.aspectRatio === '4:3') targetRatio = 4 / 3;
    else if (opts.aspectRatio === '16:9') targetRatio = 16 / 9;

    const currentRatio = srcWidth / srcHeight;

    if (currentRatio > targetRatio) {
      // Source is wider than target: crop horizontally
      cropWidth = Math.round(srcHeight * targetRatio);
      cropX = Math.round((srcWidth - cropWidth) / 2);
    } else {
      // Source is taller than target: crop vertically
      cropHeight = Math.round(srcWidth / targetRatio);
      cropY = Math.round((srcHeight - cropHeight) / 2);
    }
  }

  // Calculate target dimensions respecting maxDimension
  const maxDim = opts.maxDimension || 600;
  let destWidth = cropWidth;
  let destHeight = cropHeight;

  if (destWidth > maxDim || destHeight > maxDim) {
    if (destWidth > destHeight) {
      destHeight = Math.round((destHeight * maxDim) / destWidth);
      destWidth = maxDim;
    } else {
      destWidth = Math.round((destWidth * maxDim) / destHeight);
      destHeight = maxDim;
    }
  }

  // Ensure minimum dimensions
  destWidth = Math.max(1, destWidth);
  destHeight = Math.max(1, destHeight);

  // Render onto Canvas
  const canvas = document.createElement('canvas');
  canvas.width = destWidth;
  canvas.height = destHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Apply visual adjustments if specified
  const brightnessVal = 100 + (opts.brightness || 0);
  const contrastVal = 100 + (opts.contrast || 0);
  const saturateVal = opts.saturation !== undefined ? opts.saturation : 100;
  ctx.filter = `brightness(${brightnessVal}%) contrast(${contrastVal}%) saturate(${saturateVal}%)`;

  // Draw image with smooth scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, destWidth, destHeight);

  // Format selection
  const chosenFormat = opts.format || 'image/webp';
  const quality = opts.quality ?? 0.82;

  let dataUrl = '';
  try {
    dataUrl = canvas.toDataURL(chosenFormat, quality);
    // Fallback if browser doesn't support WebP export
    if (chosenFormat === 'image/webp' && !dataUrl.startsWith('data:image/webp')) {
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }
  } catch {
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }

  // Calculate optimized size in bytes
  const base64Index = dataUrl.indexOf(',');
  const optimizedBytes = base64Index !== -1
    ? Math.round((dataUrl.length - base64Index - 1) * 0.75)
    : dataUrl.length;

  const savedPercent = originalBytes > 0
    ? Math.max(0, Math.round(((originalBytes - optimizedBytes) / originalBytes) * 100))
    : 0;

  return {
    dataUrl,
    originalBytes,
    optimizedBytes,
    savedPercent,
    width: destWidth,
    height: destHeight,
    format: chosenFormat
  };
}

/**
 * Format bytes into human readable format (e.g. 45.2 KB)
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Quick helper for basic file uploads
 */
export async function optimizeImageFile(
  file: File,
  maxDimension = 600,
  quality = 0.82
): Promise<string> {
  const result = await optimizeImage(file, {
    maxDimension,
    quality,
    format: file.type === 'image/png' ? 'image/png' : 'image/webp'
  });
  return result.dataUrl;
}
