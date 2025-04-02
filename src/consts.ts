export const DOMAIN = 'interslavic-dictionary.com'
export const alphabetTypes = [
    {
        name: 'latin',
        value: 'latin',
    },
    {
        name: 'cyrillic',
        value: 'cyrillic',
    },
    {
        name: 'glagolitic',
        value: 'glagolitic',
    },
]

export const ISV_SRC = 'isv-src'
export const ISV = 'isv'
export const EN = 'en'

export const LANGS = [
    'ru',
    'be',
    'uk',
    'pl',
    'cs',
    'sk',
    'sl',
    'hr',
    'sr',
    'mk',
    'bg',
]

export const ADD_LANGS = [
    'de',
    'nl',
    'eo',
    'cu',
    'csb',
    'dsb',
    'hsb',
    'ia',
    'es',
    'pt',
    'fr',
    'it',
    'he',
    'da',
]

export const initialFields = [
    'id',
    'isv',
    'addition',
    'partOfSpeech',
    'type',
    'en',
    'sameInLanguages',
    'genesis',
    'intelligibility',
]

export const initialAddFields = [
    'sameInLanguages',
    'genesis',
]

export const basicFields = [
    ...initialFields,
    ...LANGS,
]

export const validFields = [
    ...basicFields,
    ...ADD_LANGS,
]

export interface ITableData {
    spreadsheetId: string;
    sheetId: string;
    fields: string[];
}

export const tablesData: ITableData[] = [
    {
        spreadsheetId: '1N79e_yVHDo-d026HljueuKJlAAdeELAiPzdFzdBuKbY',
        sheetId: '1987833874',
        fields: basicFields,
    },
    {
        spreadsheetId: '1N79e_yVHDo-d026HljueuKJlAAdeELAiPzdFzdBuKbY',
        sheetId: '2005431854',
        fields: ADD_LANGS,
    },
]

export const tableColumnsLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const wordErrorsTypes = [
    'translate',
    'synonym',
    'interslavic',
]

export const captchaSiteKey = '0x4AAAAAAAz3DWhwL4ABSW4W'
export const wordErrorTextMaxLength = 120
export const REP_LINK = 'https://github.com/sonic16x/interslavic'

export const interfaceLanguageList = [
    {
        name: 'English',
        value: 'en',
    },
    {
        name: 'Medžuslovjansky',
        value: 'isv-Latn',
    },
    {
        name: 'Меджусловјанскы',
        value: 'isv-Cyrl',
    },
    {
        name: 'Ⰿⰵⰴⰶⱆⱄⰾⱁⰲⰺⰰⱀⱄⰽⱐⰹ',
        value: 'isv-Glag',
    },
    {
        name: 'Русский',
        value: 'ru',
    },
    {
        name: 'Українська',
        value: 'uk',
    },
    {
        name: 'Беларуская',
        value: 'be',
    },
    {
        name: 'Polski',
        value: 'pl',
    },
    {
        name: 'Česky',
        value: 'cs',
    },
    {
        name: 'Slovenský',
        value: 'sk',
    },
    {
        name: 'Slovenščina',
        value: 'sl',
    },
    {
        name: 'Hrvatski',
        value: 'hr',
    },
    {
        name: 'Српски',
        value: 'sr',
    },
    {
        name: 'Македонски',
        value: 'mk',
    },
    {
        name: 'Български',
        value: 'bg',
    },
]
