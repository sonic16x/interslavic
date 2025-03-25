import { EN, ISV } from 'consts'

import translations from 'translations/data.json'

import {
    createTaggedTemplate,
    getCyrillic,
    getGlagolitic,
    getLatin,
    parseI18nString,
} from 'utils'

let currentLang = EN

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

function tRaw(key: string) {
    const [lang, alphabet] = currentLang.split('-')

    if (translations[key] && lang in translations[key]) {
        if (lang === ISV) {
            const parsed = parseI18nString(translations[key][ISV])
            // transliteration & flavorisation of isv word
            switch (alphabet) {
                case 'Latn':
                    return toLatin(...parsed)
                case 'Cyrl':
                    return toCyrillic(...parsed)
                case 'Glag':
                    return toGlagolitic(...parsed)
            }
        }

        return translations[key][lang]
    }

    if (translations[key] && EN in translations[key]) {
        return translations[key][EN]
    }

    return key
}

export function t(key, params?: ITranslateParams) {
    const rawTranslate = tRaw(key)

    if (params) {
        return replaceParams(rawTranslate, params)
    }

    return rawTranslate
}

export function setLang(lang: string) {
    currentLang = lang
}
