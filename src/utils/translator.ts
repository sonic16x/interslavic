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
        .replace(/[óôö]/g, 'o')
        .replace(/[řŕ]/g, 'r')
        .replace(/[śš]/g, 's')
        .replace(/[ß]/g, 'ss')
        .replace(/[ť]/g, 't')
        .replace(/[úůü]/g, 'u')
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
let langsList;
const percentsOfChecked = {};
const isvToLatinMap = new Map();
const isvAddMap = new Map();
const splittedMap = new Map();

export function splitWords(text: string): string[] {
    return text.includes(';') ? text.split(';') : text.split(',');
}

export function removeBrackets(text: string, left: string, right: string): string {
    const posOpen = text.indexOf(left);
    if (posOpen !== -1) {
        const posClose = text.indexOf(right);
        if (posClose > posOpen) {
            return removeBrackets((text.slice(0, posOpen) + text.slice(posClose + 1))
                .replace('  ', ' ').trim(), left, right);
        }
    }
    return text;
}

export function removeExclamationMark(text: string): string {
    return text.slice(0, 1) === '!' ? text.slice(1) : text;
}

export function levenshteinDistance(a, b) {
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

export function inputPrepare(lang, text) {
    const lowerCaseText = text.toLowerCase()
        .replace(' ', '')
        .replace(',', '')
        .replace(/[\u0300-\u036f]/g, '');
    switch (lang) {
        case 'isv':
            return isvToEngLatin(lowerCaseText);
        case 'cs':
        case 'pl':
        case 'sk':
        case 'sl':
        case 'hr':
        case 'de':
            return filterLatin(lowerCaseText);
        case 'ru':
            return lowerCaseText.replace('ё', 'е');
        case 'sr':
            return srGajevicaToVukovica(lowerCaseText);
        default:
            return lowerCaseText;
    }
}

export function searchPrepare(lang, text) {
    let lowerCaseText = text.toLowerCase()
        .replace(' ', '')
        .replace(',', '')
        .replace(/[\u0300-\u036f]/g, '');
    if (lang !== 'isv') {
        lowerCaseText = removeBrackets(lowerCaseText, '(', ')');
        lowerCaseText = removeBrackets(lowerCaseText, '[', ']');
    } else {
        lowerCaseText = convertCases(lowerCaseText);
        lowerCaseText = removeBrackets(lowerCaseText, '[', ']');
    }
    switch (lang) {
        case 'isv':
            return isvToEngLatin(lowerCaseText);
        case 'cs':
        case 'pl':
        case 'sk':
        case 'sl':
        case 'hr':
        case 'de':
            return filterLatin(lowerCaseText);
        case 'ru':
            return lowerCaseText.replace('ё', 'е');
        default:
            return lowerCaseText;
    }
}

function getSplittedField(from: string, item: string[]): string[] {
    const key = `${getField(item, from)}-${getField(item, 'addition')}`;
    return splittedMap.get(key);
}

export function convertCases(add) {
    return add
        .replace('+2', '+Gen.')
        .replace('+3', '+Dat.')
        .replace('+4', '+Acc.')
        .replace('+5', '+Ins.')
        .replace('+6', '+Loc.');
}

export function initDictionary(wordList: string[][]) {
    header = wordList.shift().map((l) => l.replace(/\W/g, ''));
    langsList = header.filter(
        (item) => (['partOfSpeech', 'type', 'sameInLanguages', 'genesis', 'addition', 'id'].indexOf(item) === -1),
    );
    headerIndexes = new Map(Object.keys(header).map((i) => [header[i], i]));
    words = wordList;
    words.forEach((item) => {
        const isvWord = getField(item, 'isv');
        const add = getField(item, 'addition')
            .replace(/[\(\) ]/g, '')
            .split(/[,;/]/)
        ;
        isvAddMap.set(getField(item, 'addition'), add);
        isvToLatinMap.set(isvWord, normalize(getLatin(isvWord, 3)));
        splitWords(isvWord)
            .concat(add)
            .map((item) => {
                isvToLatinMap.set(item, normalize(getLatin(item, 3)));
            });
        add.map((item) => {
                isvToLatinMap.set(item, normalize(getLatin(item, 3)));
            });
        langsList.forEach((from) => {
            const key = `${getField(item, from)}-${getField(item, 'addition')}`;
            const fromField = getField(item, from);
            let splittedField;
            if (from === 'isv') {
                splittedField = splitWords(fromField).concat(isvAddMap.get(getField(item, 'addition')));
            } else {
                splittedField = splitWords(removeExclamationMark(fromField));
            }
            splittedMap.set(key, splittedField.map((chunk) => searchPrepare(from, chunk)));
        });
    });
    calculatePercentsOfTranslated();
}

function calculatePercentsOfTranslated() {
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
    original: string;
    originalCyr: string;
    originalGla: string;
    add: string;
    addCyr: string;
    addGla: string;
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
    const text = inputPrepare(from, inputText);
    if (!text) {
        return [];
    }
    const distMap = new WeakMap();

    const results = words
        .filter((item) => {
            const fromField = getField(item, from);
            const toField = getField(item, to);
            if (fromField === '!' || toField === '!') {
                return false;
            }
            const splittedField = getSplittedField(from, item);
            return splittedField.some((chunk) => searchTypes[searchType](chunk, text));
        })
        .map((item) => {
            const splittedField = getSplittedField(from, item);
            const dist = splittedField
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
    return results;
}

export function formatTranslate(
    results: string[][],
    from: string,
    to: string,
    flavorisationType: string,
): ITranslateResult[] {
    return results.map((item) => {
        const isv = getField(item, 'isv');
        const add = getField(item, 'addition');
        const translate = getField(item, (from === 'isv' ? to : from));
        return {
            translate: removeExclamationMark(translate),
            original: getLatin(isv, flavorisationType),
            originalCyr: getCyrillic(isv, flavorisationType),
            originalGla: latinToGla(getLatin(isv, flavorisationType)),
            add: convertCases(getLatin(add, flavorisationType)),
            addCyr: convertCases(getCyrillic(add, flavorisationType)),
            addGla: convertCases(latinToGla(getLatin(add, flavorisationType))),
            details: getField(item, 'partOfSpeech'),
            ipa: latinToIpa(getLatin(removeBrackets(isv, '[', ']'), flavorisationType)),
            checked: translate[0] !== '!',
        };
    });

}

export function getWordList(): string[][] {
    return words;
}
