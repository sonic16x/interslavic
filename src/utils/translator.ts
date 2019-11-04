import { latinToIpa } from './latinToIpa';
import { latinToGla } from './latinToGla';
import { srGajevicaToVukovica } from './srGajevicaToVukovica';
import { transliterate } from 'utils/legacy/transliterate';

const searchTypes = {
    begin: (item, text) => item.indexOf(text) === 0,
    full: (item, text) => item === text,
    end: (item, text) =>  item.includes(text) && item.indexOf(text) === item.length - text.length,
    some: (item, text) => item.includes(text),
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

function filterLatin(text) {
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

export function getCyrillic(text, flavorisationType): string {
    if (!text) {
        return '';
    }
    return transliterate(text, 5, flavorisationType, 0, 1);
}

export function getLatin(text, flavorisationType): string {
    if (!text) {
        return '';
    }
    return transliterate(text, 1, flavorisationType, 0, 1);
}

let header;
let words;
let headerIndexes;
const percentsOfChecked = {};
const isvToLatinMap = new Map();
const isvAddMap = new Map();
const splitPattern = /,/;

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

export function getField(item, fieldName): string {
    return item[headerIndexes.get(fieldName)];
}

export function isvToEngLatin(text) {
    const latin = isvToLatinMap.get(text);
    if (!latin) {
        return normalize(getLatin(text, 3));
    }
    return latin;
}

function searchPrepare(lang, text) {
    const lowerCaseText = text.toLowerCase().replace(/ /g, '');
    switch (lang) {
        case 'isv':
            return isvToEngLatin(lowerCaseText);
        case 'cs':
        case 'pl':
        case 'sk':
        case 'sl':
        case 'hr':
            return filterLatin(lowerCaseText);
        case 'ru':
            return lowerCaseText.replace(/[ё]/g, 'е');
        case 'sr':
            return srGajevicaToVukovica(lowerCaseText);
        default:
            return lowerCaseText;
    }
}

export function initDictionary(wordList: string[][]) {
    header = wordList.shift().map((l) => l.replace(/\W/g, ''));
    headerIndexes = new Map(Object.keys(header).map((i) => [header[i], i]));
    words = wordList;
    words.forEach((item) => {
        const isvWord = getField(item, 'isv');
        const add = getField(item, 'addition')
            .replace(/\(|\)/g, '').replace(/ /g, '').split(/,|;/)
        ;
        isvAddMap.set(getField(item, 'addition'), add);
        isvToLatinMap.set(isvWord, normalize(getLatin(isvWord, 3)));
        isvWord.split(splitPattern)
            .concat(add)
            .map((item) => {
                isvToLatinMap.set(item, normalize(getLatin(item, 3)));
            });
        add.map((item) => {
                isvToLatinMap.set(item, normalize(getLatin(item, 3)));
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
    translateCyrillic?: string;
    original: string;
    originalAdd?: string;
    originalAddCyrillic?: string;
    add?: string;
    addCyrillic?: string;
    translateGla?: string;
    addGla?: string;
    originalGla?: string;
    originalAddGla?: string;
    details: string;
    ipa: string;
    checked: boolean;
}

export function translate(
    inputText: string,
    from: string,
    to: string,
    searchType: string,
): string[][] {
    const text = searchPrepare(from, inputText);
    if (!text) {
        return [];
    }
    const distMap = new WeakMap();

    return words
        .filter((item) => {
            const fromField = getField(item, from);
            const toField = getField(item, to);
            if (fromField === '!' || toField === '!') {
                return false;
            }
            let splittedField = fromField
                .replace(/^!/, '')
                .split(splitPattern)
            ;
            if (from === 'isv') {
                splittedField = splittedField.concat(isvAddMap.get(getField(item, 'addition')));
            }
            return splittedField.some((sp) => searchTypes[searchType](searchPrepare(from, sp), text));
        })
        .map((item) => {
            const dist = getField(item, from)
                .split(splitPattern)
                .reduce((acc, item) => {
                    const lDist = levenshteinDistance(text, searchPrepare(from, item));
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
}

export function formatTranslate(
    results: string[][],
    from: string,
    to: string,
    flavorisationType: string,
): ITranslateResult[] {
    if (from === 'isv') {
        return results.map((item) => {
            const isv = getField(item, 'isv');
            const add = getField(item, 'addition');
            const translate = getField(item, to);
            return {
                translate: translate.replace(/^!/, ''),
                originalCyrillic: getCyrillic(isv, flavorisationType),
                originalGla: latinToGla(getLatin(isv, flavorisationType)),
                original: getLatin(isv, flavorisationType),
                originalAdd: getLatin(add, flavorisationType),
                originalAddGla: latinToGla(getLatin(add, flavorisationType)),
                originalAddCyrillic: getCyrillic(add, flavorisationType),
                details: getField(item, 'partOfSpeech'),
                ipa: latinToIpa(getLatin(isv, flavorisationType)),
                checked: translate[0] !== '!',
            };
        });
    } else {
        return results.map((item) => {
            const isv = getField(item, 'isv');
            const add = getField(item, 'addition');
            const original = getField(item, from);
            return {
                translate: getLatin(isv, flavorisationType),
                translateCyrillic: getCyrillic(isv, flavorisationType),
                translateGla: latinToGla(getLatin(isv, flavorisationType)),
                original: original.replace(/^!/, ''),
                add: getLatin(add, flavorisationType),
                addCyrillic: getCyrillic(add, flavorisationType),
                addGla: latinToGla(getLatin(add, flavorisationType)),
                details: getField(item, 'partOfSpeech'),
                ipa: latinToIpa(getLatin(isv, flavorisationType)),
                checked: original[0] !== '!',
            };
        });
    }
}

export function getWordList(): string[][] {
    return words;
}
