import { transliterate } from '@interslavic/utils';

export function getGlagolitic(text: string, flavorisationType: string): string {
    if (!text) {
        return '';
    }

    switch (flavorisationType) {
        case '2': return transliterate(text, 'art-Glag-x-interslv-etym');
        case '4': return transliterate(text, 'art-Glag-x-interslv-sloviant');
        case 'J': return transliterate(text, 'art-Glag-x-interslv-southern');
        case 'S': return transliterate(text, 'art-Glag-x-interslv-northern');
        default: return transliterate(text, 'art-Glag-x-interslv');
    }
}
