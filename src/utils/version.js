/**
 * Application version information
 * Update this version number when deploying new versions
 */
export const APP_VERSION = '1.0.0';
export const BUILD_DATE = '2024-06-25';
export const VERSION_STRING = `${APP_VERSION} (${BUILD_DATE})`;

/**
 * Creates a cache buster parameter based on the app version
 * @returns {string} Cache buster parameter
 */
export function getCacheBuster() {
  // Using timestamp will always generate a new value
  return `v=${APP_VERSION}-${Date.now()}`;
}

/**
 * Adds a cache busting parameter to a URL
 * @param {string} url - The URL to modify
 * @returns {string} URL with cache busting parameter
 */
export function addCacheBuster(url) {
  if (!url) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${getCacheBuster()}`;
}

/**
 * Clear application cache and reload
 * Useful when a new version is detected
 */
export function clearCacheAndReload() {
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        if (cacheName.includes('grocery-sync')) {
          console.log('Clearing cache:', cacheName);
          caches.delete(cacheName);
        }
      });
      
      console.log('Cache cleared, reloading application...');
      window.location.reload(true);
    });
  } else {
    // Fallback for browsers that don't support Cache API
    console.log('Cache API not supported, reloading application...');
    window.location.reload(true);
  }
} 