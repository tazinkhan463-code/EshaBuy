/**
 * Safe local storage utility that handles QuotaExceededError and provides fallbacks.
 */

export function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    const stringified = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringified);
    return true;
  } catch (err: any) {
    console.warn(`LocalStorage quota error for key ${key}:`, err);
    // If quota exceeded, clean up non-essential caches
    try {
      // Clear non-critical temporary session logs if any
      sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
}

export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}
