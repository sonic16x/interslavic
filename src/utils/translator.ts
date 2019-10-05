import cyrillicToLatin from 'cyrillic-to-latin';
// import latinToCyrillic from 'latin-to-cyrillic';
import { latinToIpa } from './latinToIpa';
import { transliterate } from './legacy';
import words from './words.json';

const searchTypes = {
    full: (item, text) => item === text,
    begin: (item, text) => item.indexOf(text) === 0,
    some: (item, text) => item.indexOf(text) !== -1,
};

function normalize(text) {
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

const langIndexes = {
    ins: 0,
    en: 4,
    ru: 7,
    uk: 8,
    cs: 9,
    pl: 10,
};

export function transalte(
    inputText: string, from: string, to: string, searchType: string, flavorisationType: string): any[] {
    // const header = [
    //     'slo',
    //     'add',
    //     'pos',
    //     'slo',
    //     'eng',
    //     'lex',
    //     'sla',
    //     'ru',
    //     'uk',
    //     'cs',
    //     'pl',
    // ];
    let text = inputText.toLowerCase();
    if (from === 'ins') {
        text = cyrillicToLatin(text);
        text = normalize(text);
    }

    const result = words
        .filter((item) => item[langIndexes[from]])
        .filter((item) => {
            return item[langIndexes[from]]
                .split(',')
                .map((l) => l.replace(/ /, ''))
                .some((sp) => searchTypes[searchType](from === 'ins' ? normalize(sp) : sp, text))
                ;
        });

    if (from === 'ins') {
        return result.map((item) => ({
            translate: item[langIndexes[to]],
            original: getLatin(item[0], flavorisationType),
            originalCyrillic: getCyrillic(item[0], flavorisationType),
            originalAdd: getLatin(item[1], flavorisationType),
            originalAddCyrillic: getCyrillic(item[1], flavorisationType),
            pos: item[2],
        }));
    } else {
        return result.map((item) => ({
            translateCyrillic: getCyrillic(item[0], flavorisationType),
            translate: getLatin(item[0], flavorisationType),
            add: getLatin(item[1], flavorisationType),
            addCyrillic: getCyrillic(item[1], flavorisationType),
            pos: item[2],
            original: item[langIndexes[from]],
            sameLanguages: item[5],
            ipa: latinToIpa(getLatin(item[0], flavorisationType)),
        }));
    }
}
