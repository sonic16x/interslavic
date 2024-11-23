import { CASH_URLS } from './cashUrls';

// Add to cache all data
self.addEventListener("install", (event: any) => {
    event.waitUntil(
        caches
            .open(VERSION)
            .then((cache) => cache.addAll(CASH_URLS))
    );
});

self.addEventListener("fetch", (event: any) => {
    if (event.request.method !== 'GET') {
        return;
    }

    // Try to find data in cache
    event.respondWith(
        caches
            .match(event.request)
            .then((cache) => {
                // Request data from network
                const network = fetch(event.request)
                    .then((response) => (
                        caches
                            .open(VERSION)
                            .then((cache) => cache.put(event.request, response.clone())) // Update cache
                            .then(() => response)
                    ));

                // Prefer get data from cache here
                return cache || network;
            })
    );

    // Update cache in background
    event.waitUntil(
        caches
            .open(VERSION)
            .then((cache) => (
                fetch(event.request).then((response) =>
                    cache.put(event.request, response.clone())
                )
            ))
    );
});

self.addEventListener("activate", (event: any) => {
    // Delete old cache versions
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key !== VERSION)
                    .map((key) => caches.delete(key))
            ))
    );
});
