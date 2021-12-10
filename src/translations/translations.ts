import translations from 'translations/data.json';

import { getCyrillic } from 'utils/getCyrillic';
import { getGlagolitic } from 'utils/getGlagolitic';
import { getLatin } from 'utils/getLatin';

let currentLang;

interface ITranslateParams {
    [key: string]: string;
}

function replaceParams(str, params?: ITranslateParams) {
    return Object.keys(params).reduce((acc, paramKey) => (
        acc.replace(/[{}]/g, '').replace(new RegExp(`__${paramKey}__`, 'g'), params[paramKey])
    ), str);
}

function tRaw(key) {
    const [lang, alphabet] = currentLang.split('-');
    if (!translations[key]) {
        return key;
    } else if (translations[key][lang]) {
        if (lang === 'isv') {
            switch (alphabet) {
                case 'Latn':
                    return getLatin(translations[key].isv, '3');
                case 'Cyrl':
                    return getCyrillic(translations[key].isv, '3');
                case 'Glag':
                    return getGlagolitic(translations[key].isv, '3');
            }
        } else {
            return translations[key][lang];
        }
    } else if (translations[key].en) {
        return translations[key].en;
    } else {
        return key;
    }
}

export function t(key, params?: ITranslateParams) {
    const rawTranslate = tRaw(key);

    if (params) {
        return replaceParams(rawTranslate, params);
    } else {
        return rawTranslate;
    }
}

export function setLang(lang) {
    currentLang = lang;
}
