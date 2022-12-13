import { transliterate } from '@interslavic/steen-utils';

export function getLatin(text: string, flavorisationType: string): string {
    if (!text) {
        return '';
    }

    switch (flavorisationType) {
        case '2':
            return transliterate(text, 'art-Latn-x-interslv-etym');
        case '3':
            return transliterate(text, 'art-Latn-x-interslv');
        case '4':
            return transliterate(text, 'art-Latn-x-interslv-sloviant');
        case 'S':
            return transliterate(text, 'art-Latn-x-interslv-northern');
        case 'J':
            return transliterate(text, 'art-Latn-x-interslv-southern');
        default:
            return transliterate(text, 'art-Latn-x-interslv');
    }
}
