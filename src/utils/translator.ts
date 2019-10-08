import { latinToIpa } from './latinToIpa';
import { transliterate } from './legacy';

const searchTypes = {
    begin: (item, text) => item.toLowerCase().indexOf(text) === 0,
    full: (item, text) => item.toLowerCase() === text,
    some: (item, text) => item.toLowerCase().indexOf(text) !== -1,
};

function normalize(text) {
    if (!text) {
        return '';
    }
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\W/g, '')
        ;
}

function filterCyryllic(text) {
    return text.replace(/[ąáä]/g, 'a')
        .replace(/[ćč]/g, 'c')
        .replace(/[ďđ]/g, 'd')
        .replace(/[ęéě]/g, 'e')
        .replace(/[í]/g, 'i')
        .replace(/[łĺľ]/g, 'l')
        .replace(/[ńň]/g, 'n')
        .replace(/[óô]/g, 'o')
        .replace(/[řŕ]/g, 'r')
        .replace(/[śš]/g, 's')
        .replace(/[ť]/g, 't')
        .replace(/[úů]/g, 'u')
        .replace(/[ý]/g, 'y')
        .replace(/[źżž]/g, 'z')
    ;
}

function getCyrillic(text, flavorisationType): string {
    if (!text) {
        return '';
    }
    return transliterate(text, 5, flavorisationType, 0, 1);
}

function getLatin(text, flavorisationType): string {
    if (!text) {
        return '';
    }
    return transliterate(text, 1, flavorisationType, 0, 1);
}

let header;
let words;
let headerIndexes;
const percentsOfChecked = {};
const isnToLatinMap = new Map();

function levenshteinDistance(a, b) {
    if (a.length === 0) {
        return b.length;
    }
    if (b.length === 0) {
        return a.length;
    }

    const matrix = [];

    // increment along the first column of each row
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}

function getField(item, fieldName) {
    return item[headerIndexes.get(fieldName)];
}

function isvToEngLatin(text) {
    const latin = isnToLatinMap.get(text);
    if (!latin) {
        return normalize(getLatin(text, 3));
    }
    return latin;
}

function searchPrepare(lang, text) {
    if (lang === 'isv') {
        return isvToEngLatin(text);
    }

    if (['cs', 'pl', 'sk', 'sl', 'hr'].indexOf(lang) !== -1) {
        text = filterCyryllic(text);
    }

    return text.toLowerCase();
}

export function initDictionary(wordList: string[][]) {
    header = wordList.shift().map((l) => l.replace(/\W/g, ''));
    words = wordList.map((line) => {
        return line.map((item, i) => {
            if (['partOfSpeech', 'type', 'sameInLanguages', 'genesis', 'addition'].indexOf(header[i]) === -1) {
                return item.replace(/ /, '');
            }
            return item;
        });
    });
    headerIndexes = new Map(Object.keys(header).map((i) => [header[i], i]));
    words.forEach((item) => {
        const isvWord = item[0];
        isnToLatinMap.set(isvWord, normalize(getLatin(isvWord, 3)));
        item[0].split(/,|-/)
            .map((item) => {
                isnToLatinMap.set(item, normalize(getLatin(item, 3)));
            });
    });
    calculatePercentsOfTranslated();
}

function calculatePercentsOfTranslated() {
    const langsList = header.filter(
        (item) => (['partOfSpeech', 'type', 'sameInLanguages', 'genesis', 'addition'].indexOf(item) === -1),
    );
    langsList.forEach((fieldName) => {
        const notChecked = words.filter((item) => getField(item, fieldName)[0] === '!');
        const count = (1 - notChecked.length / words.length) * 100;
        percentsOfChecked[fieldName] = count.toFixed(1);
    });
}

export function getPercentsOfTranslated() {
    return percentsOfChecked;
}

export interface ITranslateResult {
    translate: string;
    translateCyrillic: string;
    original: string;
    originalAdd?: string;
    originalAddCyrillic?: string;
    add: string;
    addCyrillic: string;
    pos: string;
    ipa?: string;
    checked: boolean;
}

export function translate(
    inputText: string, from: string, to: string, searchType: string, flavorisationType: string,
): any[] {
    let text = inputText.toLowerCase().replace(/ /, '');
    if (from === 'isv') {
        // Translate from cyrillic to latin
        text = isvToEngLatin(text);
    }

    const distMap = new WeakMap();

    const result = words
        .filter((item) => {
            const fromField = getField(item, from);
            const toField = getField(item, to);
            if (fromField === '!' || toField === '!') {
                return false;
            }
            return fromField
                .replace(/!/, '')
                .split(/,|-/)
                .some((sp) => searchTypes[searchType](from === 'isv' ? isvToEngLatin(sp) : sp, text))
                ;
        })
        .map((item) => {
            const dist = getField(item, from)
                .split(/,|-/)
                .reduce((acc, item) => {
                    const lowerCaseItem = item.toLowerCase();
                    const preparedItem = from === 'isv' ? isvToEngLatin(lowerCaseItem) : lowerCaseItem;
                    const lDist = levenshteinDistance(text, preparedItem);
                    if (acc === false) {
                        return lDist;
                    }
                    if (lDist < acc) {
                        return lDist;
                    }
                    return acc;
                }, false);
            distMap.set(item, dist);
            return item;
        })
        .sort((a, b) => distMap.get(a) - distMap.get(b))
        .slice(0, 50)
    ;

    if (from === 'isv') {
        return result.map((item) => {
            const ins = getField(item, 'isv');
            const add = getField(item, 'addition');
            const translate = getField(item, to);
            return {
                translate: translate.replace(/!/, ''),
                originalCyrillic: getCyrillic(ins, flavorisationType),
                original: getLatin(ins, flavorisationType),
                originalAdd: getLatin(add, flavorisationType),
                originalAddCyrillic: getCyrillic(add, flavorisationType),
                pos: getField(item, 'partOfSpeech'),
                checked: translate[0] !== '!',
            };
        });
    } else {
        return result.map((item) => {
            const ins = getField(item, 'isv');
            const add = getField(item, 'addition');
            const original = getField(item, from);
            return {
                translate: getLatin(ins, flavorisationType),
                translateCyrillic: getCyrillic(ins, flavorisationType),
                original: original.replace(/!/, ''),
                add: getLatin(add, flavorisationType),
                addCyrillic: getCyrillic(add, flavorisationType),
                pos: getField(item, 'partOfSpeech'),
                ipa: latinToIpa(getLatin(ins, flavorisationType)),
                checked: original[0] !== '!',
            };
        });
    }
}
