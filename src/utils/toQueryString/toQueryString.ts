export function toQueryString(keyValues: Record<string, (string | number | boolean)>): string {
    return Object.keys(keyValues).map((key) => `${key}=${keyValues[key]}`).join('&');
}
