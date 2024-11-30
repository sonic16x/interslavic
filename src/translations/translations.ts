import translations from 'translations/data.json'

import {
    createTaggedTemplate,
    getCyrillic,
    getGlagolitic,
    getLatin,
    parseI18nString,
} from 'utils'

let currentLang

const toLatin = createTaggedTemplate((s) => getLatin(String(s), '3'), 'strings')
const toCyrillic = createTaggedTemplate((s) => getCyrillic(String(s), '3'), 'strings')
const toGlagolitic = createTaggedTemplate((s) => getGlagolitic(String(s), '3'), 'strings')

interface ITranslateParams {
    [key: string]: string;
}

function replaceParams(str, params?: ITranslateParams) {
    return Object.keys(params).reduce((acc, paramKey) => (
        acc.replace(/[{}]/g, '').replace(new RegExp(`__${paramKey}__`, 'g'), params[paramKey])
    ), str)
}

function tRaw(key) {
    const [lang, alphabet] = currentLang.split('-')
    if (!translations[key]) {
        return key
    } else if (translations[key][lang]) {
        if (lang === 'isv') {
            const parsed = parseI18nString(translations[key].isv)
            // transliteration & flavorisation of isv word
            switch (alphabet) {
                case 'Latn':
                    return toLatin(...parsed)
                case 'Cyrl':
                    return toCyrillic(...parsed)
                case 'Glag':
                    return toGlagolitic(...parsed)
            }
        } else {
            return translations[key][lang]
        }
    } else if (translations[key].en) {
        return translations[key].en
    } else {
        return key
    }
}

export function t(key, params?: ITranslateParams) {
    const rawTranslate = tRaw(key)
    if (params) {
        return replaceParams(rawTranslate, params)
    } else {
        return rawTranslate
    }
}

export function setLang(lang) {
    currentLang = lang
}
