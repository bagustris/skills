const CACHE_VERSION = '{{APP_NAME}}-v1';

// Explicit file list, not a glob — must mirror every <script>/<link> in
// index.html. Bump CACHE_VERSION whenever any of these change, or installed
// offline clients silently keep serving the stale version.
const CORE_ASSETS = [
  '.',
  'index.html',
  'style.css',
  'manifest.json',
  'CHANGELOG.md',
  'js/settings.js',
  'js/app.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Stale-while-revalidate: serve from cache instantly, then refresh the
// cache in the background so the app works fully offline while still
// picking up updates whenever the network is available.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const cached = await cache.match(event.request);
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
