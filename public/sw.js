const CACHE_NAME = 'cloud-world-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/script/main.js',
  '/images/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

