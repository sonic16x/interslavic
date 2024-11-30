export function removeExclamationMark(text: string): string {
    return text.charAt(0) === '!' ? text.substring(1) : text
}
