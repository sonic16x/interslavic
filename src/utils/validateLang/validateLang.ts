import { addLangs, langs } from 'consts'

export function validateLang(lang: string): boolean {
    const validLangs: string[] = [
        'en',
        ...langs,
        ...addLangs,
    ].reduce((acc, lang) => [...acc, `isv-${lang}`, `${lang}-isv`], [])

    return Boolean(lang && validLangs.includes(lang))
}
