export function filterDiacritics(text: string): string {
    return text
        .replace(/[\u0300-\u036f]/g, '');
}
