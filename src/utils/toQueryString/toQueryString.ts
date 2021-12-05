export function toQueryString(keyValues: Record<string, any>): string {
    return Object.keys(keyValues).map((key) => `${key}=${keyValues[key]}`).join('&');
}
