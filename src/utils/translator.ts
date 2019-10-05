import cyrillicToLatin from 'cyrillic-to-latin';
import latinToCyrillic from 'latin-to-cyrillic';
import { latinToIpa } from './latinToIpa';
import { words } from './words';

const searchTypes = {
    full: (item, text) => normalize(item) === text,
    begin: (item, text) => normalize(item).indexOf(text) === 0,
    some: (item, text) => normalize(item).indexOf(text) !== -1,
};

function normalize(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W/g, '').replace(/ /, '');
}

function prepareTranslate(text): string {
    return latinToCyrillic(text);
}

export function transalte(inputText: string, lang: string, searchType: string): any[] {
    // const header = [
    //     'slo',
    //     'add',
    //     'pos',
    //     'slo',
    //     'eng',
    //     'lex',
    //     'sla',
    // ];
    let text = inputText;
    text = cyrillicToLatin(text);
    text = normalize(text);
    if (lang === 'ins') {
        const result = words.filter((item) => item[0].split(',').some((sp) => searchTypes[searchType](sp, text)));
        return result.map((item) => ({
            translate: item[4],
            original: item[0],
            originalCyrillic: prepareTranslate(item[0]),
            originalAdd: item[1],
            originalAddCyrillic: prepareTranslate(item[1]),
            pos: item[2],
        }));
    }
    if (lang === 'en') {
        const result = words.filter((item) => item[4].split(',').some((sp) => searchTypes[searchType](sp, text)));
        return result.map((item) => ({
            translateCyrillic: prepareTranslate(item[0]),
            translate: item[0],
            add: item[1],
            addCyrillic: prepareTranslate(item[1]),
            pos: item[2],
            original: item[4],
            sameLanguages: item[5],
            ipa: latinToIpa(item[0]),
        }));
    }
}
