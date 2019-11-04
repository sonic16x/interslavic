import { dictionaryUrl } from 'consts';

/* tslint:disable */
const CACHE_NAME = 'interslavic-dictionary';
const cacheUrls = [
    dictionaryUrl,
    // 'index.html',
    // 'manifest.json',
    // `index.${HASH_ID}.js`,
    // 'https://dl.dsropboxusercontent.com/s/mxu7cxl5ubh3t3t/mapPolyfillv2.min.js?dl=0',
    // 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
];

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(cacheUrls))
    );
});

self.addEventListener('activate', (event) => {
    // console.log('activate');
});

const MAX_AGE = 60 * 60 * 1000;

self.addEventListener('fetch', (event: any) => {
    event.respondWith(
        // Trying find resource in cache.
        caches.match(event.request).then((cachedResponse) => {
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
