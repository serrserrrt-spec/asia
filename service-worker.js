const CACHE_NAME = "asia-family-trip-2026-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./package.json",
  "./src/app.js",
  "./src/router.js",
  "./src/state.js",
  "./src/budget.js",
  "./src/transport.js",
  "./src/maps.js",
  "./src/checklists.js",
  "./src/sources.js",
  "./src/styles.css",
  "./src/print.css",
  "./data/trip.js",
  "./data/routes-a.js",
  "./data/routes-b.js",
  "./data/routes-c.js",
  "./data/locations.js",
  "./data/restaurants.js",
  "./data/transport.js",
  "./data/budget.js",
  "./data/currencies.js",
  "./data/options.js",
  "./data/checklists.js",
  "./data/sources.js",
  "./data/plan-b.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fresh = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && new URL(event.request.url).origin === location.origin) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
