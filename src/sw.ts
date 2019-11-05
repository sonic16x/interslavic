import { dictionaryUrl } from 'consts';

/* tslint:disable */
const CACHE_NAME = 'interslavic-dictionary';
const cacheUrls = [
    dictionaryUrl,
    'index.html',
    'manifest.json',
    `index.${HASH_ID}.js`,
    `vendors~grammarComponent~index.${HASH_ID}.js`,
    `grammarComponent.${HASH_ID}.js`,
    `grammarComponent~index.${HASH_ID}.js`,
    `logo.png`,
    // `sw.${HASH_ID}.js`,
];

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(cacheUrls))
    );
});

self.addEventListener('activate', (event) => {
    // console.log('activate');
});

const MAX_AGE = 31557600;

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
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
                        // Return new data.
                        return response;
                    }).catch(() => cachedResponse);
                }
                return cachedResponse;
            }

            // Request from network.
            return fetch(event.request);
        })
    );
});
