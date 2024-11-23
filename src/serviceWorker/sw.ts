import { CASH_URLS } from './cashUrls';

self.addEventListener("install", (event: any) => {
    event.waitUntil(
        caches
            .open(`${VERSION}fundamentals`)
            .then((cache) => cache.addAll(CASH_URLS))
    );
});

self.addEventListener("fetch", (event: any) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches
            .match(event.request)
            .then((cached) => {
                const networked = fetch(event.request)
                    .then((response: any) => {
                        const cacheCopy = response.clone();

                        caches
                            .open(`${VERSION}pages`)
                            .then((cache) => cache.put(event.request, cacheCopy))

                        return response;
                    });

                return cached || networked;
            })
    );
});

self.addEventListener("activate", (event: any) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => !key.startsWith(VERSION))
                    .map((key) => caches.delete(key))
            ))
    );
});
