const updateCache = (type: string) => (
    fetch('/cacheList.json')
        .then((response) => response.json()) // Парсим JSON
        .then((urls) => {
            // eslint-disable-next-line no-console
            console.log('urls', type, urls)

            return caches.open(__VERSION__).then((cache) => (
                cache.addAll(urls)
            ))
        })
)


self.addEventListener('install', (event: any) => {
    event.waitUntil(updateCache('install'))
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
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key !== __VERSION__)
                    .map((key) => caches.delete(key))
            ))
            .then(() => updateCache('activate'))
    )
})
