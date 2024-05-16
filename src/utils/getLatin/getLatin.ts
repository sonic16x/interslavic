import { transliterate } from '@interslavic/utils';

export function getLatin(text: string, flavorisationType: string, loose = false): string {
    if (!text) {
        return '';
    }

    const strict = !loose;
    switch (flavorisationType) {
        case '2': return transliterate(text, 'isv-Latn-x-etymolog', strict);
        case '4': return transliterate(text, 'isv-Latn-x-sloviant', strict);
        case 'J': return transliterate(text, 'isv-Latn-x-southern', strict);
        case '1':
        case 'S':
            return transliterate(text, 'isv-Latn-x-northern', strict);
        default:
            return transliterate(text, 'isv-Latn', strict);
    }
}
