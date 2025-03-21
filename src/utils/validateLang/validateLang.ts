import { ADD_LANGS, EN, LANGS } from 'consts'

export function validateLang(lang: string): boolean {
    const validLangs: string[] = [
        EN,
        ...LANGS,
        ...ADD_LANGS,
    ].reduce((acc, lang) => [...acc, `isv-${lang}`, `${lang}-isv`], [])

    return Boolean(lang && validLangs.includes(lang))
}
