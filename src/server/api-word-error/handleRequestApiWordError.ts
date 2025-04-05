import { responseHeaders } from '../headers'
import { responseError } from '../responseError'

import { addRow } from './addRow'
import { checkCaptcha } from './checkCaptcha'
import { getTableHeader } from './getTableHeader'
import { googleAuth } from './googleAuth'
import { validateData } from './validateData'

export async function handleRequestApiWordError(request: Request, env) {
    const data = await request.json()
    const dataIsValid = validateData(data)

    if (!dataIsValid) {
        return responseError('invalidData')
    }

    const ip = request.headers.get('CF-Connecting-IP')
    const captchaIsOk = await checkCaptcha(env.CLOUDFLARE_CAPTCHA_SECRET_KEY, data.captchaToken, ip)

    if (!captchaIsOk) {
        return responseError('invalidCaptcha')
    }

    const googleAccessToken = await googleAuth(env.GOOGLE_SERVICE_ACCOUNT_EMAIL, env.GOOGLE_PRIVATE_KEY)

    if (!googleAccessToken) {
        return responseError('invalidGoogleAccessToken')
    }

    const tableHeader = await getTableHeader(env.GOOGLE_WORD_ERRORS_TABLE_ID, googleAccessToken)

    if (!tableHeader || !tableHeader.length) {
        return responseError('invalidTableHeader')
    }

    const newRow = tableHeader.map((fieldName) => {
        if (fieldName === 'timestamp') {
            return Math.round(new Date().getTime() / 1000).toString()
        }

        return data[fieldName]
    })

    const addRowResponse = await addRow(env.GOOGLE_WORD_ERRORS_TABLE_ID, newRow, googleAccessToken)

    if (addRowResponse.status === 200) {
        return new Response(JSON.stringify({ error: null }), {
            status: addRowResponse.status,
            headers: responseHeaders,
        })
    } else {
        return responseError('invalidAddRow')
    }
}
