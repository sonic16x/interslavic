import { transliterate } from '@interslavic/utils';

export function getLatin(text: string, flavorisationType: string): string {
    if (!text) {
        return '';
    }

    switch (flavorisationType) {
        case '2': return transliterate(text, 'art-Latn-x-interslv-etym');
        case '4': return transliterate(text, 'art-Latn-x-interslv-sloviant');
        case 'J': return transliterate(text, 'art-Latn-x-interslv-southern');
        case '1':
        case 'S':
            return transliterate(text, 'art-Latn-x-interslv-northern');
        default:
            return transliterate(text, 'art-Latn-x-interslv');
    }
}
