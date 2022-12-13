import translations from 'translations/data.json';

import { transliterate } from "@interslavic/steen-utils";

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
            return transliterate(translations[key].isv, `art-${alphabet}-x-interslv`);
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
