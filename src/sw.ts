import { addLangs } from 'consts';

const CACHE_NAME = 'interslavic-dictionary';
const cacheUrls = [
    'index.html',
    'data/basic.json',
    'data/translateStatistic.json',
    ...addLangs.map((lang) => `data/${lang}.json`),
    'manifest.json',
    'grammarComponent.js',
    'index.js',
    'sw.js',
    'styles/grammarComponent.css',
    'styles/index.css',
];

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(cacheUrls))
    );
});

// self.addEventListener('activate', () => {
//     console.log('activate');
// });

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
