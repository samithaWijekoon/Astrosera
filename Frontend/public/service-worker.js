const CACHE_NAME = 'astrosera-cache-v1';

// Assets to cache upfront
const INITIAL_CACHED_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event: cache initial resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(INITIAL_CACHED_RESOURCES);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Cache-First strategy for images/fonts/UI, network fallback.
// Exclude huge videos by checking for typical video extensions or destination.
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Skip caching for API calls, chrome extensions, and videos
  if (requestUrl.protocol === 'chrome-extension:' || requestUrl.pathname.includes('/api/')) {
    return;
  }
  
  // Exclude background videos from cache to save storage
  if (requestUrl.pathname.endsWith('.mp4') || requestUrl.pathname.endsWith('.webm') || event.request.destination === 'video') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-First strategy
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse; // Return from cache
      }

      // Not in cache, fetch from network
      return fetch(event.request).then(networkResponse => {
        // Don't cache bad responses or opaque responses for now
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone the response to put in cache
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback (e.g., return a generic offline page if requested, but we'll handle this in the UI)
      });
    })
  );
});
