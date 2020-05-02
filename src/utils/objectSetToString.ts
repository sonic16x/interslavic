export function objectSetToString(obj: object): string {
    return Object.keys(obj).filter((key) => obj[key]).sort().join(',');
}
