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
];

export const langs = [
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
];

export const addLangs = [
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
];

export const dataDelimiter = '<>';

export const initialFields = [
    'id',
    'isv',
    'addition',
    'partOfSpeech',
    'type',
    'en',
    'sameInLanguages',
    'genesis',
];

export const initialAddFields = [
    'type',
    'sameInLanguages',
    'genesis',
];

export const basicFields = [
    ...initialFields,
    ...langs,
];

export const validFields = [
    ...basicFields,
    ...addLangs,
];

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
        fields: addLangs,
    },
];

export const tableColumnsLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
