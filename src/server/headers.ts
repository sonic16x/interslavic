export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
}

export const responseHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/json',
}
