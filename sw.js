const CACHE_NAME = "tw93-cache-v1";
const FONT_BASE_URL = "https://gw.alipayobjects.com/os/k/jinkai/";
const IMMUTABLE_ASSETS = [
  "https://gw.alipayobjects.com/os/k/s3/lightense.min.js",
  "https://gw.alicdn.com/imgextra/i4/O1CN01XYYPwL1uheeXASHIQ_!!6000000006069-2-tps-420-420.png", // Favicon/Logo
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  const isImmutableAsset =
    IMMUTABLE_ASSETS.includes(url) ||
    url.startsWith(FONT_BASE_URL) ||
    url.includes("/css/jinkai.css");

  if (isImmutableAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            (response.type !== "cors" && response.type !== "basic")
          ) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      }),
    );
  }
});
