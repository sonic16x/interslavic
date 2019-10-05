import cyrillicToLatin from 'cyrillic-to-latin';
import latinToCyrillic from 'latin-to-cyrillic';
import { latinToIpa } from './latinToIpa';
import words from './words.json';

const searchTypes = {
    full: (item, text) => item === text,
    begin: (item, text) => item.indexOf(text) === 0,
    some: (item, text) => item.indexOf(text) !== -1,
};

function normalize(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W/g, '').replace(/ /, '');
}

function prepareTranslate(text): string {
    return latinToCyrillic(text);
}

const langIndexes = {
    ins: 0,
    en: 4,
    ru: 7,
    uk: 8,
    cs: 9,
    pl: 10,
};

export function transalte(inputText: string, from: string, to: string, searchType: string): any[] {
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
    let text = inputText;
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
            original: item[0],
            originalCyrillic: prepareTranslate(item[0]),
            originalAdd: item[1],
            originalAddCyrillic: prepareTranslate(item[1]),
            pos: item[2],
        }));
    } else {
        return result.map((item) => ({
            translateCyrillic: prepareTranslate(item[0]),
            translate: item[0],
            add: item[1],
            addCyrillic: prepareTranslate(item[1]),
            pos: item[2],
            original: item[langIndexes[from]],
            sameLanguages: item[5],
            ipa: latinToIpa(item[0]),
        }));
    }
}
