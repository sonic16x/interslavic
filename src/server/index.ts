import { addRow } from 'server/addRow';
import { checkCaptcha } from 'server/checkCaptcha';
import { getTableHeader } from 'server/getTableHeader';
import { googleAuth } from 'server/googleAuth';
import { validateData } from 'server/validateData';

addEventListener('fetch', (event) => {
    // eslint-disable-next-line
    // @ts-ignore
    event.respondWith(
        // eslint-disable-next-line
        // @ts-ignore
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
});

const responseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
}

function responseError(error) {
    return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: responseHeaders,
    });
}

async function handleRequest(request) {
    const data = await request.json();
    const { pathname } = new URL(request.url);

    if (!pathname.startsWith('/api/word-error')) {
        return responseError('invalidPath');
    }

    const dataIsValid = validateData(data);

    if (!dataIsValid) {
        return responseError('invalidData');
    }

    const captchaIsOk = await checkCaptcha(GOOGLE_CAPTCHA_SECRET_KEY, data.captchaToken);

    if (!captchaIsOk) {
        return responseError('invalidCaptcha');
    }

    const googleAccessToken = await googleAuth(GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY);

    if (!googleAccessToken) {
        return responseError('invalidGoogleAccessToken');
    }

    const tableHeader = await getTableHeader(GOOGLE_WORD_ERRORS_TABLE_ID, googleAccessToken);

    if (!tableHeader || !tableHeader.length) {
        return responseError('invalidTableHeader');
    }

    const newRow = tableHeader.map((fieldName) => {
        if (fieldName === 'timestamp') {
            return Math.round(new Date().getTime() / 1000).toString();
        }

        return data[fieldName];
    });

    const addRowResponse = await addRow(GOOGLE_WORD_ERRORS_TABLE_ID, newRow, googleAccessToken);

    if (addRowResponse.status === 200) {
        return new Response(JSON.stringify({}), {
            status: addRowResponse.status,
            headers: responseHeaders,
        });
    } else {
        return responseError('invalidAddRow');
    }
}
