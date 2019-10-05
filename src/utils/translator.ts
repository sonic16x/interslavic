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
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /, '');
}

function prepareTranslate(text, spellingType): string {
    if (spellingType === 'cyrillic') {
        return latinToCyrillic(text);
    }
    return text;
}

export function transalte(inputText: string, lang: string, searchType: string, spellingType: string) {
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
    if (spellingType === 'cyrillic') {
        text = cyrillicToLatin(text);
    }
    text = normalize(text);
    if (lang === 'ins') {
        const result = words.filter((item) => item[0].split(',').some((sp) => searchTypes[searchType](sp, text)));
        return result.map((item) => ({
            translate: item[4],
            pos: item[2],
        }));
    }
    if (lang === 'en') {
        const result = words.filter((item) => item[4].split(',').some((sp) => searchTypes[searchType](sp, text)));
        return result.map((item) => ({
            translate: prepareTranslate(item[0], spellingType),
            add: item[1],
            pos: item[2],
            original: item[5],
            ipa: latinToIpa(item[0]),
        }));
    }
}
