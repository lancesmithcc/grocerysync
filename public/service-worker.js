// Cache version - update this timestamp when deploying new versions
const CACHE_VERSION = '20240625-1';
const CACHE_NAME = `grocery-sync-${CACHE_VERSION}`;

// URLs to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/App.css',
  '/src/assets/icons/cart.svg',
  '/src/assets/icons/logo.png'
];

// Install service worker
self.addEventListener('install', event => {
  // Activate new service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // Skip cache for API requests
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('db.fauna.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(error => {
          console.error('Fetch failed:', error);
          // Return a fallback response if available or handle offline content
        });
      })
  );
});

// Update service worker and clean old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    // Claim clients so the new service worker takes effect immediately
    self.clients.claim().then(() => {
      // Delete old caches
      return caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      });
    })
  );
}); 