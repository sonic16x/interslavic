import { toQueryString } from 'utils/toQueryString';

export async function checkCaptcha(secret, response) {
    const captchaParams = toQueryString({
        secret,
        response,
    });

    const captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?${captchaParams}`, {
        method: 'POST',
    });

    const captchaResponseData = await captchaResponse.json();

    return captchaResponseData.success;
}
