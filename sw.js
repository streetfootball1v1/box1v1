const CACHE_NAME = 'box1v1-v1';
const urlsToCache = [
  './',
  './index.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) return response;
      return fetch(e.request).catch(() => {
        if (e.request.url.includes('google')) {
          return new Response('[]', { headers: {'Content-Type': 'application/json'} });
        }
      });
    })
  );
});
