export function filterDiacritics(text: string): string {
    return text
        .replace(/[\u0300-\u036f]/g, '');
}

export function filterIjekavijanDiacritics(text: string): string {
    return text
        .replace(/[\u0316\u0329\u0331]/g, '');
}
