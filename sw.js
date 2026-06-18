const CACHE = 's1-geo-v2';
const URLS = [
  '.',
  'index.html',
  'index.md',
  'manifest.json',
  'icon.svg',
  'unit4/',
  'unit4/index.html',
  'unit4/4-1.html',
  'unit4/4-2.html',
  'unit4/4-3.html',
  'unit5/',
  'unit5/index.html',
  'unit5/5-1.html',
  'unit5/5-2.html',
  'unit5/5-3.html',
  'unit5/5-4.html',
  'unit6/',
  'unit6/index.html',
  'unit6/6-1.html',
  'unit6/6-2.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(cache => cache.put(req, clone));
      return res;
    }))
  );
});