import { latinToIpa } from './latinToIpa';
import { transliterate } from './legacy';

const searchTypes = {
    full: (item, text) => item === text,
    begin: (item, text) => item.indexOf(text) === 0,
    some: (item, text) => item.indexOf(text) !== -1,
};

function normalize(text) {
    if (!text) {
        return '';
    }
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\W/g, '')
        .replace(/ /, '')
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

const header = [
    'ins', // Word in interslavic.
    'addition', // Addition to word in interslavic.
    'partOfSpeech', // Part of speech for en.
    'type', // Archaisms, Neologisms, Slavicisms.
    'en',
    'sameInLanguages', // Languages where this word looks the same.
    'genesis', // S - Slavic, I - International, D/G - German, E - English, F - French, T - Turkish.
    'ru',
    'uk',
    'cs',
    'pl',
    'sk',
    'sl',
    'bg',
    'hr',
    'sr',
    'mk',
    'be',
];

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

const headerIndexes = new Map(Object.keys(header).map((i) => [header[i], i]));

function getField(item, fieldName) {
    return item[headerIndexes.get(fieldName)];
}

export function translate(
    inputText: string, from: string, to: string, searchType: string, flavorisationType: string, wordList: string[][],
): any[] {
    let text = inputText.toLowerCase();
    if (from === 'ins') {
        // Translate from cyrillic to latin
        text = transliterate(text, 1, 3, 0, 1);
        text = normalize(text);
    }

    const distMap = new WeakMap();

    const words = wordList.slice(1);

    const result = words
        // .filter((item) => item[headerIndexes.get(from)]) // Filter for null values
        .filter((item) => {
            return getField(item, from)
                .split(',')
                .map((s) => s.split('-'))
                .flat()
                .map((l) => l.replace(/ /, ''))
                .some((sp) => searchTypes[searchType](from === 'ins' ? normalize(sp) : sp.toLowerCase(), text))
                ;
        })
        .map((item) => {
            const dist = getField(item, from)
                .split(',')
                .map((s) => s.split('-'))
                .flat()
                .reduce((acc, l) => {
                    const wws = l.replace(/ /, '').toLowerCase();
                    const lDist = levenshteinDistance(text, (from === 'ins' ? normalize(wws) : wws));
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

    if (from === 'ins') {
        return result.map((item) => {
            const ins = getField(item, 'ins');
            const add = getField(item, 'addition');
            const translate = getField(item, to);
            return {
                translate: translate.replace(/!/, ''),
                original: getLatin(ins, flavorisationType),
                originalCyrillic: getCyrillic(ins, flavorisationType),
                originalAdd: getLatin(add, flavorisationType),
                originalAddCyrillic: getCyrillic(add, flavorisationType),
                pos: getField(item, 'partOfSpeech'),
                checked: translate[0] !== '!',
            };
        });
    } else {
        return result.map((item) => {
            const ins = getField(item, 'ins');
            const add = getField(item, 'addition');
            const original = getField(item, from);
            return {
                translateCyrillic: getCyrillic(ins, flavorisationType),
                translate: getLatin(ins, flavorisationType),
                add: getLatin(add, flavorisationType),
                addCyrillic: getCyrillic(add, flavorisationType),
                pos: getField(item, 'partOfSpeech'),
                original: original.replace(/!/, ''),
                ipa: latinToIpa(getLatin(ins, flavorisationType)),
                checked: original[0] !== '!',
            };
        });
    }
}
