import { transliterate } from '@interslavic/steen-utils';

export function getCyrillic(text: string, flavorisationType: string): string {
    if (!text) {
        return '';
    }

    switch (flavorisationType) {
        case '2':
            return transliterate(text, 'art-Cyrl-x-interslv-etym');
        case '3':
            return transliterate(text, 'art-Cyrl-x-interslv');
        case '4':
            return transliterate(text, 'art-Cyrl-x-interslv-sloviant');
        case 'S':
            return transliterate(text, 'art-Cyrl-x-interslv-northern');
        case 'J':
            return transliterate(text, 'art-Cyrl-x-interslv-southern');
        default:
            return transliterate(text, 'art-Cyrl-x-interslv');
    }
}
