import { transliterate } from 'legacy/transliterate';

export function getGlagolitic(text: string, flavorisationType: string): string {
    if (!text) {
        return '';
    }
    return transliterate(text, 7, flavorisationType, 0, 1);
}
