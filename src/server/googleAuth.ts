import { toQueryString } from 'utils/toQueryString';

// Function to encode an object with base64
function objectToBase64url(object) {
    return arrayBufferToBase64Url(
        new TextEncoder().encode(JSON.stringify(object)),
    );
}

// Function to encode array buffer with base64
function arrayBufferToBase64Url(buffer) {
    const arrayBuffer = new Uint8Array(buffer);

    // eslint-disable-next-line
    // @ts-ignore
    return btoa(String.fromCharCode(...arrayBuffer))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
    ;
}

// Function to convert string to array buffer
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);

    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }

    return buf;
}

export async function googleAuth(googleServiceAccountEmail, googlePrivateKey) {
    // Step 1 - Create the JWT header and encode to base64
    const googleJwtHeader = objectToBase64url({
        // RSA SHA-256 algorithm is mandatory for Google
        alg: 'RS256',
        // JWT token format is mandatory for Google
        typ: 'JWT',
    });

    // Step 2 - Create the JWT claim set and encode to base64

    // Define the time the assertion was issued
    const assertionTime = Math.round(Date.now() / 1000);

    // Define the expiration time of the assertion, maximum 1 minute
    const expiryTime = assertionTime + 60;

    // JWT claim payload
    const googleJwtClaimset = objectToBase64url({
        'iss': googleServiceAccountEmail,
        'scope': 'https://www.googleapis.com/auth/spreadsheets',
        'aud': 'https://oauth2.googleapis.com/token',
        'exp': expiryTime,
        'iat': assertionTime,
    });

    // Combine the JWT header + claim and convert to byte array for signing
    const googleJwtCombined = str2ab(`{${googleJwtHeader}}.{${googleJwtClaimset}}`);

    // Step 3 - Sign the combined googleJwtHeader and googleJwtClaimset

    // Private key - TESTING ONLY - SHOULD BE A SECRET, NOT BE STORED IN CODE!!
    // Paste the whole key into here from your secrets.json, including \n

    // Tidy up the key ahead of importing
    const privateKeyCleaned = googlePrivateKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/(\r\n|\n|\r)/gm, '')
    ;

    // base64 decode the string to get the binary data
    const privateKeyBinary = str2ab(atob(privateKeyCleaned));

    // Import the private key into the crypto store
    // eslint-disable-next-line
    // @ts-ignore
    const signingKey = await crypto.subtle.importKey(
        'pkcs8',
        privateKeyBinary,
        {
            name: 'RSASSA-PKCS1-V1_5',
            hash: { name: 'SHA-256' },
        },
        false,
        ['sign'],
    );

    // Sign the googleJwtHeader and googleJwtClaimset
    const rawToken = await crypto.subtle.sign(
        { name: 'RSASSA-PKCS1-V1_5' },
        signingKey,
        googleJwtCombined,
    );

    // Convert the signature to Base64URL format
    const googleJwtSigned = arrayBufferToBase64Url(rawToken);

    // Combine the headers with signature
    const combinedHeadersSigned = `{${googleJwtHeader}}.{${googleJwtClaimset}}.{${googleJwtSigned}}`;

    // Step 4 - Send the request

    // Create payload
    const googleJwtPayload = toQueryString({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: combinedHeadersSigned,
    });

    // Make the OAUTH request
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            'Host': 'oauth2.googleapis.com',
        },
        body: googleJwtPayload,
    });

    // Grab the JSON from the response
    const { access_token } = await response.json();

    // Capture the access token
    return access_token;
}
