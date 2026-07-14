const CACHE_NAME = 'beubella-fieldiq-pwa-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-180.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png'
];
// Every network attempt inside this file is bounded — if a request stalls
// (opens but never completes or errors, a real and common mobile-network
// failure mode), it is aborted after 8 seconds and treated as a network
// failure, falling through to the cache. Without this, a stalled fetch()
// inside respondWith() would leave the page's own resource request
// hanging indefinitely — this is what produced pages that "kept loading
// indefinitely" in the earlier service worker.
function fetchWithTimeout(request, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms || 8000);
  return fetch(request, { signal: controller.signal }).finally(() => clearTimeout(timer));
}
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(err => {
        // A missing or failing app-shell file (e.g. one icon returning a
        // non-200) previously caused addAll() to reject with no handler,
        // which fails the entire install silently — the update would
        // never activate and no one would know why. Logged, not
        // swallowed, and does not throw further: skipWaiting() below
        // still runs so a partial-shell install doesn't block activation
        // of an otherwise-working update.
        console.error('[sw] app shell caching failed:', err);
      })
  );
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.hostname.endsWith('workers.dev')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetchWithTimeout(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('/index.html')))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      fetchWithTimeout(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
