import { handleRequestApiWordError } from './api-word-error'
import { handleRequestCompress } from './compress-data'
import { handleOptions } from './handleOptions'
import { responseError } from './responseError'

export async function handleRequest(request: Request, env) {
    if (request.method === 'OPTIONS') {
        return handleOptions(request)
    }

    const { pathname } = new URL(request.url)

    if (
        pathname.startsWith('/data/') ||
        pathname.startsWith('/assets/')
    ) {
        return handleRequestCompress(request)
    }

    if (pathname.startsWith('/api/word-error')) {
        return handleRequestApiWordError(request, env)
    }

    return responseError('invalidPath')
}
