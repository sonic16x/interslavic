import { transliterate } from '@interslavic/utils';

export function getCyrillic(text: string, flavorisationType: string): string {
    if (!text) {
        return '';
    }

    switch (flavorisationType) {
        case '1': return transliterate(text, 'art-Cyrl-x-interslv-iotated-ext');
        case '2': return transliterate(text, 'art-Cyrl-x-interslv-etym');
        case '4': return transliterate(text, 'art-Cyrl-x-interslv-sloviant');
        case 'J': return transliterate(text, 'art-Cyrl-x-interslv-southern');
        case 'S': return transliterate(text, 'art-Cyrl-x-interslv-northern');
        default: return transliterate(text, 'art-Cyrl-x-interslv');
    }
}
