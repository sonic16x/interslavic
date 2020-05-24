import request from 'request';

const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_AUTH_TOKEN } = process.env;

const options = {
    method: 'POST',
    url: `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
    headers: {
        'Authorization': `Bearer ${CLOUDFLARE_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
    },
    body: '{"purge_everything":true}',
};

request(options, (error, response, body) => {
    // tslint:disable
    console.log(error);
    console.log(body);
});
