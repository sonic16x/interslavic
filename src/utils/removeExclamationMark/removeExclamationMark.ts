export function removeExclamationMark(text: string): string {
    return text.slice(0, 1) === '!' ? text.slice(1) : text;
}
