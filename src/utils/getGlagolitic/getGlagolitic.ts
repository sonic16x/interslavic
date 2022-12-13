import { transliterate } from '@interslavic/steen-utils';

export function getGlagolitic(text: string, flavorisationType: string): string {
    if (!text) {
        return '';
    }

    switch (flavorisationType) {
        case '2':
            return transliterate(text, 'art-Glag-x-interslv');
        case '4':
            return transliterate(text, 'art-Glag-x-interslv-sloviant');
        case 'J':
            return transliterate(text, 'art-Glag-x-interslv-southern');
        default:
            return transliterate(text, 'art-Glag-x-interslv');
    }
}
