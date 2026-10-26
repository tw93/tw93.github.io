const CACHE_NAME = "tw93-cache-v1";
// Posts rarely change after publishing, so repeat visits are served from cache
// at once and refreshed in the background. Home and list pages stay on the
// network so a new post shows up immediately.
const PAGE_CACHE = "tw93-pages-v1";
const PAGE_CACHE_LIMIT = 40;
const POST_PAGE = /^\/(?:en\/)?\d{4}-\d{2}-\d{2}\/[^/]+\.html$/;
const FONT_BASE_URL = "https://gw.alipayobjects.com/os/k/jinkai/";
const IMMUTABLE_ASSETS = [
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
          if (cacheName !== CACHE_NAME && cacheName !== PAGE_CACHE) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

const trimPageCache = async (cache) => {
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - PAGE_CACHE_LIMIT)).map((key) => cache.delete(key)));
};

const servePage = async (event) => {
  const cache = await caches.open(PAGE_CACHE);
  const cached = await cache.match(event.request, { ignoreSearch: true });
  const network = fetch(event.request).then(async (response) => {
    // Redirected responses cannot answer a navigation, so never store them.
    if (response.ok && !response.redirected) {
      await cache.delete(event.request, { ignoreSearch: true });
      await cache.put(event.request, response.clone());
      await trimPageCache(cache);
    }
    return response;
  });
  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network;
};

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  const { origin, pathname } = new URL(url);

  if (event.request.mode === "navigate" && origin === self.location.origin && POST_PAGE.test(pathname)) {
    event.respondWith(servePage(event));
    return;
  }
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
