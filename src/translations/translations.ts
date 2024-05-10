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
            // preserving substitutions in brackets {} from transliteration
            let isvText = '', isvSubst = [], i = 0;
            isvText = translations[key].isv.replace(/\{.*?\}/g,(match) => { 
                isvSubst[i++] = match.slice(1,-1); 
                return '{' + i + '}';
            });
            // transliteration & flavorisation of isv word 
            switch (alphabet) {
                case 'Latn':
                    isvText = getLatin(isvText, '3'); break;
                case 'Cyrl':
                    isvText = getCyrillic(isvText, '3'); break;
                case 'Glag':
                    isvText = getGlagolitic(isvText, '3'); break;
            }
            // restoring substitutions in brackets
            return isvText.replace(/\{\d+\}/g, (match) => isvSubst[parseInt(match.slice(1,-1))-1]);
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
