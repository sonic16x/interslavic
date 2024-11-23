import { CASH_URLS } from './cashUrls';

const cacheName = VERSION

self.addEventListener("install", (event: any) => {
    event.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => cache.addAll(CASH_URLS))
    );
});

self.addEventListener("fetch", (event: any) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches
            .match(
                event.request,
                {
                    ignoreSearch: event.request.url.indexOf('?') != -1,
                }
            )
            .then((cache) => {
                const network = fetch(event.request)
                    .then((response) => (
                        caches
                            .open(cacheName)
                            .then((cache) => cache.put(event.request, response.clone()))
                            .then(() => response)
                    ));

                return cache || network;
            })
    );

    event.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => (
                fetch(event.request).then((response) =>
                    cache.put(event.request, response.clone())
                )
            ))
    );
});

self.addEventListener("activate", (event: any) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key !== cacheName)
                    .map((key) => caches.delete(key))
            ))
    );
});
