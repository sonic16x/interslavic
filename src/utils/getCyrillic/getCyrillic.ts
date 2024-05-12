import { transliterate } from '@interslavic/utils';

export function getCyrillic(text: string, flavorisationType: string, loose = false): string {
    if (!text) {
        return '';
    }

    const strict = !loose;
    switch (flavorisationType) {
        case '1': return transliterate(text, 'isv-Cyrl-x-iotated-ext', strict);
        case '2': return transliterate(text, 'isv-Cyrl-x-etymolog', strict);
        case '4': return transliterate(text, 'isv-Cyrl-x-sloviant', strict);
        case 'J': return transliterate(text, 'isv-Cyrl-x-southern', strict);
        case 'S': return transliterate(text, 'isv-Cyrl-x-northern', strict);
        default: return transliterate(text, 'isv-Cyrl', strict);
    }
}
