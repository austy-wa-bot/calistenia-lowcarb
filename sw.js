const CACHE = 'calistenia-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll([
        'index.html',
        'style.css',
        'app.js',
        'dados/exercicios.js',
        'dados/alimentos.js',
        'dados/receitas.js',
        'paginas/inicio.js',
        'paginas/exercicios.js',
        'paginas/timer.js',
        'paginas/dieta.js',
        'paginas/progresso.js',
        'manifest.json',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png',
        'icons/icon-180x180.png'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
