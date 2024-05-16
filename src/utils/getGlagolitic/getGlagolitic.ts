import { transliterate } from '@interslavic/utils';

export function getGlagolitic(text: string, flavorisationType: string, loose = false): string {
    if (!text) {
        return '';
    }

    const strict = !loose;
    switch (flavorisationType) {
        case '2': return transliterate(text, 'isv-Glag-x-etymolog', strict);
        case '4': return transliterate(text, 'isv-Glag-x-sloviant', strict);
        case 'J': return transliterate(text, 'isv-Glag-x-southern', strict);
        case 'S': return transliterate(text, 'isv-Glag-x-northern', strict);
        default: return transliterate(text, 'isv-Glag', strict);
    }
}
