export async function checkCaptcha(secret, response, remoteip) {
    const captchaResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: JSON.stringify({ secret, response, remoteip }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const captchaResponseData = await captchaResponse.json()

    return captchaResponseData.success
}
