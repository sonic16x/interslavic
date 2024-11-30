import { corsHeaders } from './headers'

export function handleOptions (request) {
    if (
        request.headers.get('Origin') !== null &&
        request.headers.get('Access-Control-Request-Method') !== null &&
        request.headers.get('Access-Control-Request-Headers') !== null
    ) {
        return new Response(null, {
            headers: {
                ...corsHeaders,
                'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
            },
        })
    } else {
        return new Response(null, {
            headers: {
                Allow: 'GET, HEAD, POST, OPTIONS',
            },
        })
    }
}
