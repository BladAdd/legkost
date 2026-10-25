/* «Лёгкость» — Service Worker.
   Работает и в корне, и в подпапке (GitHub Pages /legkost/), потому что все пути относительные.
   Стратегия: оболочка — network-first с офлайн-фолбэком, картинки — cache-first.
*/
const CACHE = 'legkost-v4';

const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/recipe-details.js',
  './js/db.js',
  './js/app.js',
  './js/assistant.js',
  './manifest.webmanifest',
  './assets/stores/orsk.jpg',
  './assets/stores/orsk-thumb.jpg',
  './assets/stores/pyaterochka.jpg',
  './assets/stores/magnit.jpg',
  './assets/stores/lenta.jpg',
  './assets/stores/svetofor.jpg',
  './assets/stores/yandex-eda.jpg',
  './assets/stores/kuper.jpg',
  './assets/avatars/avatar-1.jpg',
  './assets/avatars/avatar-2.jpg',
  './assets/avatars/avatar-3.jpg',
  './assets/avatars/avatar-4.jpg',
  './assets/avatars/avatar-5.jpg',
  './assets/avatars/avatar-6.jpg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (cache) {
        // addAll падает целиком из-за одного 404 — кэшируем по одному
        return Promise.all(ASSETS.map(function (url) {
          return cache.add(new Request(url, { cache: 'reload' })).catch(function () { });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                 // шлюз ИИ и внешние ресурсы — без SW
  if (url.pathname.indexOf('/api/') !== -1) return;                // API всегда по сети
  if (url.pathname.endsWith('prices-orsk.json')) return;           // цены всегда свежие
  if (url.pathname.endsWith('ai-endpoint.json')) return;           // адрес домашнего сервера всегда свежий

  // Код и стили: сначала сеть (чтобы обновления доходили), при офлайне — кэш
  const isCode = /\.(?:js|css|webmanifest)$/.test(url.pathname) || req.mode === 'navigate';
  if (isCode) {
    e.respondWith(
      fetch(req)
        .then(function (resp) {
          if (resp && resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () { });
          }
          return resp;
        })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            return hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined);
          });
        })
    );
    return;
  }

  // Картинки и остальная статика: сначала кэш, потом сеть
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (resp) {
        if (resp && resp.ok && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () { });
        }
        return resp;
      });
    })
  );
});
