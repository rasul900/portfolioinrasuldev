const CACHE = "rasul-dev-v1";
const OFFLINE_URL = "/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL]))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then((r) => r || caches.match(OFFLINE_URL)))
  );
});
