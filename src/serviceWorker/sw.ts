// Add to cache all data
self.addEventListener('install', (event: any) => {
    fetch('/cacheList.json').then(res => res.json()).then((cacheList) => (
        event.waitUntil(
            caches
                .open(__VERSION__)
                .then((cache) => cache.addAll(cacheList))
        )
    ))
    
})

self.addEventListener('fetch', (event: any) => {
    const url = new URL(event.request.url)

    if (event.request.method !== 'GET' || url.protocol === 'chrome-extension:') {
        return
    }

    if (url.pathname === '/is_com.js' || url.pathname === '/is-com.json' || url.pathname.startsWith('/api')) {
        event.respondWith(fetch(event.request))

        return
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
                            .open(__VERSION__)
                            .then((cache) => cache.put(event.request, response.clone())) // Update cache
                            .then(() => response)
                    ))

                // Prefer get data from cache here
                return cache || network
            })
    )

    // Update cache in background
    event.waitUntil(
        caches
            .open(__VERSION__)
            .then((cache) => (
                fetch(event.request).then((response) =>
                    cache.put(event.request, response.clone())
                )
            ))
    )
})

self.addEventListener('activate', (event: any) => {
    // Delete old cache versions
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key !== __VERSION__)
                    .map((key) => caches.delete(key))
            ))
    )
})
