import { transliterate } from 'legacy/transliterate';

export function getCyrillic(text: string, flavorisationType: string): string {
    if (!text) {
        return '';
    }
    return transliterate(text, 5, flavorisationType, 0, 1);
}
