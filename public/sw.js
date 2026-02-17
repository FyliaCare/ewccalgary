const CACHE_NAME = "ewc-calgary-v1";
const STATIC_ASSETS = [
  "/",
  "/community",
  "/offline",
  "/manifest.json",
];

// Install — pre-cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and API requests
  if (request.method !== "GET" || url.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, show offline page
          if (request.mode === "navigate") {
            return caches.match("/offline");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});

// Push notification handler
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || "New message in your community",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: data.tag || "ewc-notification",
    data: { url: data.url || "/community" },
    vibrate: [100, 50, 100],
  };
  event.waitUntil(
    self.registration.showNotification(data.title || "EWC Calgary", options)
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/community";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
