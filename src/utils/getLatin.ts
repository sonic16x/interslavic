import { transliterate } from 'legacy/transliterate';

export function getLatin(text: string, flavorisationType: string): string {
    if (!text) {
        return '';
    }
    return transliterate(text, 1, flavorisationType, 0, 1);
}
