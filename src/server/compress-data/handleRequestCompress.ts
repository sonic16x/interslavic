export async function handleRequestCompress(request: Request) {
    const { pathname } = new URL(request.url)

    const acceptEncoding = request.headers.get('Accept-Encoding') || '' // gzip, deflate, br, zstd
    let dataUrl = `https://interslavic-dictionary.com${pathname}`
    let encoding = ''

    if (acceptEncoding.includes('br')) {
        encoding = 'br'
        dataUrl += '.br'
    } else if (acceptEncoding.includes('gzip')) {
        encoding = 'gzip'
        dataUrl += '.gz'
    }

    const buffer = await fetch(dataUrl).then((item) => item.arrayBuffer())

    const headers = new Headers()

    headers.set('Content-Encoding', encoding)
    headers.set('CDN-Cache-Control', 'no-transform, public, max-age=86400, immutable')
    headers.set('Cache-Control', 'no-transform, public, max-age=86400, immutable')
    headers.set('CF-Cache-Status', 'HIT')
    headers.set('X-Cache-Status', 'HIT')

    if (pathname.endsWith('.js')) {
        headers.set('Content-Type', 'application/javascript')
    } else if (pathname.endsWith('.css')) {
        headers.set('Content-Type', 'text/css')
    } else if (pathname.endsWith('.json')) {
        headers.set('Content-Type', 'application/json')
    } else if (pathname.endsWith('.html')) {
        headers.set('Content-Type', 'text/html')
    }

    return new Response(
        buffer,
        {
            headers,
            // @ts-expect-error not documented parameter
            encodeBody: 'manual'
        }
    )
}
