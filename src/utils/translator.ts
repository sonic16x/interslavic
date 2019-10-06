import { latinToIpa } from './latinToIpa';
import { transliterate } from './legacy';
import words from './words.json';

const searchTypes = {
    full: (item, text) => item === text,
    begin: (item, text) => item.indexOf(text) === 0,
    some: (item, text) => item.indexOf(text) !== -1,
};

function normalize(text) {
    if (!text) {
        return '';
    }
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W/g, '').replace(/ /, '');
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

function levDist(s, t) {
    if (!s.length) {
        return t.length;
    }
    if (!t.length) {
        return s.length;
    }

    return Math.min(
        (levDist(s.substring(1), t) + 1),
        (levDist(t.substring(1), s) + 1),
        (levDist(s.substring(1), t.substring(1)) + (s[0] !== t[0] ? 1 : 0)));
}

const headerIndexes = new Map(Object.keys(header).map((i) => [header[i], i]));

function getField(item, fieldName) {
    return item[headerIndexes.get(fieldName)];
}

export function translate(
    inputText: string, from: string, to: string, searchType: string, flavorisationType: string): any[] {
    let text = inputText.toLowerCase();
    if (from === 'ins') {
        // Translate from cyrillic to latin
        text = transliterate(text, 1, 3, 0, 1);
        text = normalize(text);
    }

    const distMap = new WeakMap();

    const result = words
        // .filter((item) => item[headerIndexes.get(from)]) // Filter for null values
        .filter((item) => {
            return item[headerIndexes.get(from)]
                .split(',')
                .map((l) => l.replace(/ /, ''))
                .some((sp) => searchTypes[searchType](from === 'ins' ? normalize(sp) : sp.toLowerCase(), text))
                ;
        })
        .map((item) => {
            const str = from === 'ins' ? normalize(item[0]) : item[0].toLowerCase();
            const dist = levDist(str, text);
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
            return {
                translate: getField(item, to),
                original: getLatin(ins, flavorisationType),
                originalCyrillic: getCyrillic(ins, flavorisationType),
                originalAdd: getLatin(add, flavorisationType),
                originalAddCyrillic: getCyrillic(add, flavorisationType),
                pos: getField(item, 'partOfSpeech'),
            };
        });
    } else {
        return result.map((item) => {
            const ins = getField(item, 'ins');
            const add = getField(item, 'addition');
            return {
                translateCyrillic: getCyrillic(ins, flavorisationType),
                translate: getLatin(ins, flavorisationType),
                add: getLatin(add, flavorisationType),
                addCyrillic: getCyrillic(add, flavorisationType),
                pos: getField(item, 'partOfSpeech'),
                original: getField(item, from),
                ipa: latinToIpa(getLatin(ins, flavorisationType)),
            };
        });
    }
}
