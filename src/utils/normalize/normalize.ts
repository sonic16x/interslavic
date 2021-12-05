export function normalize(text: string): string {
    if (!text) {
        return '';
    }
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\W/g, '')
        ;
}
