import { addRow } from 'server/addRow';
import { checkCaptcha } from 'server/checkCaptcha';
import { getTableHeader } from 'server/getTableHeader';
import { googleAuth } from 'server/googleAuth';
import { validateData } from 'server/validateData';


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
}

const responseHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/json',
}

function responseError(error) {
    return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: responseHeaders,
    });
}

function handleOptions (request) {
    if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
    ) {
        return new Response(null, {
            headers: {
                ...corsHeaders,
                "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
            },
        })
    } else {
        return new Response(null, {
            headers: {
                Allow: "GET, HEAD, POST, OPTIONS",
            },
        })
    }
}

async function handleRequest(request, env) {
    if (request.method === "OPTIONS") {
        return handleOptions(request)
    }

    const data = await request.json();
    const { pathname } = new URL(request.url);

    if (!pathname.startsWith('/api/word-error')) {
        return responseError('invalidPath');
    }

    const dataIsValid = validateData(data);

    if (!dataIsValid) {
        return responseError('invalidData');
    }

    const ip = request.headers.get('CF-Connecting-IP');
    const captchaIsOk = await checkCaptcha(env.GOOGLE_CAPTCHA_SECRET_KEY, data.captchaToken, ip);

    if (!captchaIsOk) {
        return responseError('invalidCaptcha');
    }

    const googleAccessToken = await googleAuth(env.GOOGLE_SERVICE_ACCOUNT_EMAIL, env.GOOGLE_PRIVATE_KEY);

    if (!googleAccessToken) {
        return responseError('invalidGoogleAccessToken');
    }

    const tableHeader = await getTableHeader(env.GOOGLE_WORD_ERRORS_TABLE_ID, googleAccessToken);

    if (!tableHeader || !tableHeader.length) {
        return responseError('invalidTableHeader');
    }

    const newRow = tableHeader.map((fieldName) => {
        if (fieldName === 'timestamp') {
            return Math.round(new Date().getTime() / 1000).toString();
        }

        return data[fieldName];
    });

    const addRowResponse = await addRow(env.GOOGLE_WORD_ERRORS_TABLE_ID, newRow, googleAccessToken);

    if (addRowResponse.status === 200) {
        return new Response(JSON.stringify({ error: null }), {
            status: addRowResponse.status,
            headers: responseHeaders,
        });
    } else {
        return responseError('invalidAddRow');
    }
}

export default {
    async fetch(request, env) {
        return handleRequest(request, env).catch(
            (err) => responseError(err.stack)
        )
    }
}
