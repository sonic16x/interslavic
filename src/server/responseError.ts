import { responseHeaders } from './headers'

export function responseError(error) {
    return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: responseHeaders,
    })
}
