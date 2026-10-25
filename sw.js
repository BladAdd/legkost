/* «Лёгкость» — Service Worker. Кэширует оболочку и картинки для офлайна.
   Цены загружаются по сети при каждом старте (no-cache).
*/
const CACHE = 'legkost-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/data.js',
  '/js/recipe-details.js',
  '/js/db.js',
  '/js/app.js',
  '/js/assistant.js',
  '/manifest.webmanifest',
  '/assets/stores/orsk.jpg',
  '/assets/stores/orsk-thumb.jpg',
  '/assets/stores/pyaterochka.jpg',
  '/assets/stores/magnit.jpg',
  '/assets/stores/lenta.jpg',
  '/assets/stores/svetofor.jpg',
  '/assets/stores/yandex-eda.jpg',
  '/assets/stores/kuper.jpg',
  '/assets/avatars/avatar-1.jpg',
  '/assets/avatars/avatar-2.jpg',
  '/assets/avatars/avatar-3.jpg',
  '/assets/avatars/avatar-4.jpg',
  '/assets/avatars/avatar-5.jpg',
  '/assets/avatars/avatar-6.jpg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.addAll(ASSETS.filter(function (a) { return a; }));
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
});

self.addEventListener('fetch', function (e) {
  const url = new URL(e.request.url);
  // Запросы к шлюзу ИИ и ценам — всегда по сети
  if (url.pathname.startsWith('/api/ai/') || url.pathname === '/data/prices-orsk.json') {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (cached) {
    return cached || fetch(e.request).then(function (resp) {
      return resp;
    });
  }).catch(function () {
    return new Response('Офлайн: recurso no disponible', { status: 503 });
  }));
});
