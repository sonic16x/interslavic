import { addLangs } from 'consts';

const CACHE_NAME = 'interslavic-dictionary';
const cacheUrls = [
    'index.html',
    'data/basic.json',
    'data/translateStatistic.json',
    ...addLangs.map((lang) => `data/${lang}.json`),
    'grammarComponent.js',
    'communityComponent.js',
    'index.js',
    'sw.js',
    'styles/grammarComponent.css',
    'styles/communityComponent.css',
    'styles/index.css',
];

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(cacheUrls))
    );
});

self.addEventListener("activate", (event: any) => {
    async function deleteOldCaches() {
        // List all caches by their names.
        const names = await caches.keys();
        await Promise.all(names.map(name => {
            if (name !== CACHE_NAME) {
                // If a cache's name is the current name, delete it.
                return caches.delete(name);
            }
        }));
    }

    event.waitUntil(deleteOldCaches());
});

window.addEventListener("online", () => {
    // eslint-disable-next-line no-console
    console.log("You are online!");
});
window.addEventListener("offline",() => {
    // eslint-disable-next-line no-console
    console.log("Network connection lost!");
});

const MAX_AGE = 1000 * 60 * 10; // 10 minutes.

self.addEventListener('fetch', (event: any) => {
    event.respondWith(
        // Trying find resource in cache.
        caches.match(
            event.request,
            {
                ignoreSearch: event.request.url.indexOf('?') != -1,
            },
        ).then((cachedResponse) => {
            let lastModified;
            let fetchRequest;

            // If exist.
            if (cachedResponse) {
                // Get date of last update.
                lastModified = new Date(cachedResponse.headers.get('last-modified'));
                // If it is expired
                if (lastModified && (Date.now() - lastModified.getTime()) > MAX_AGE) {
                    fetchRequest = event.request.clone();

                    // Cretae new.
                    return fetch(fetchRequest).then((response) => {
                        // If error then load from cache.
                        if (!response || response.status !== 200) {
                            return cachedResponse;
                        }
                        // Update cache.
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response));

                        // Return new data.
                        return response.clone();
                    }).catch(() => cachedResponse);
                }
                
                return cachedResponse;
            }

            // Request from network.
            return fetch(event.request);
        })
    );
});
