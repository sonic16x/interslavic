import { toQueryString } from 'utils/toQueryString';

export async function checkCaptcha(secret, response) {
    const captchaParams = toQueryString({
        secret,
        response,
    });

    const captchaResponse = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify?${captchaParams}`, {
        method: 'POST',
    });

    const captchaResponseData = await captchaResponse.json();

    return captchaResponseData.success;
}
