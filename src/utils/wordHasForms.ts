import { getPartOfSpeech } from 'utils/wordDetails';

export function wordHasForms(isv: string, details: string) {
    const pos = getPartOfSpeech(details);

    switch (pos) {
        case 'noun':
        case 'numeral':
        case 'pronoun':
            if (isv.includes(' ') && isv.match(/[^,] [^\[]/)) {
                return false;
            }
        case 'adjective':
        case 'verb':
            return true;
        default:
            return false;
    }
}
