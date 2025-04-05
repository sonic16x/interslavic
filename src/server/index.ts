import { handleApiWordError } from './api-word-error'
import { handleCompress } from './compress-data'
import { handleOptions } from './handleOptions'
import { responseError } from './responseError'

interface ICloudflareWorkerEnv {
    CLOUDFLARE_CAPTCHA_SECRET_KEY: string;
    GOOGLE_PRIVATE_KEY: string;
    GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
    GOOGLE_WORD_ERRORS_TABLE_ID: string;
}

type Handler = (request: Request, env: ICloudflareWorkerEnv) => Promise<Response>

const routes: { match: (pathname: string) => boolean, handler: Handler }[] = [
    {
        match: (pathname) => pathname.startsWith('/data/') || pathname.startsWith('/assets/'),
        handler: handleCompress,
    },
    {
        match: (pathname) => pathname.startsWith('/api/word-error'),
        handler: handleApiWordError,
    },
]

export default {
    async fetch(request: Request, env: ICloudflareWorkerEnv) {
        if (request.method === 'OPTIONS') {
            return handleOptions(request)
        }

        const { pathname } = new URL(request.url)

        for (const route of routes) {
            if (route.match(pathname)) {
                return route.handler(request, env)
            }
        }

        return responseError('invalidPath')
    }
}
