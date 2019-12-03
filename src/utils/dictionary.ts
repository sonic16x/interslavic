import { latinToGla } from 'utils/latinToGla';
import { latinToIpa } from 'utils/latinToIpa';
import { normalize } from 'utils/normalize';
import { getCyrillic } from 'utils/getCyrillic';
import { getLatin } from 'utils/getLatin';
import { levenshteinDistance } from 'utils/levenshteinDistance';
import { srGajevicaToVukovica } from 'utils/srGajevicaToVukovica';
import { filterLatin } from 'utils/filterLatin';
import { removeBrackets } from 'utils/removeBrackets';
import { convertCases } from 'utils/convertCases';
import { removeExclamationMark } from 'utils/removeExclamationMark';

export const searchTypes = {
    begin: (item, text) => item.indexOf(text) === 0,
    full: (item, text) => item === text,
    end: (item, text) =>  item.includes(text) && item.indexOf(text) === item.length - text.length,
    some: (item, text) => item.includes(text),
};

export interface ITranslateResult {
    translate: string;
    original: string;
    originalCyr: string;
    originalGla: string;
    add: string;
    addCyr: string;
    addGla: string;
    details: string;
    ipa: string;
    checked: boolean;
}

class DictionaryClass {
    public static getInstance(): DictionaryClass {
        if (!DictionaryClass.instance) {
            DictionaryClass.instance = new DictionaryClass();
        }

        return DictionaryClass.instance;
    }

    private static instance: DictionaryClass;

    private header: string[];
    private langsList: string[];
    private headerIndexes: Map<string, number>;
    private percentsOfChecked: {[lang: string]: string};
    private words: string[][];
    private isvToLatinMap: Map<string, string>;
    private isvAddMap: Map<string, string[]>;
    private splittedMap: Map<string, string[]>;
    private splittedMap2: Map<string, string[]>;

    private constructor() {
        this.header = [];
        this.langsList = [];
        this.headerIndexes = new Map();
        this.isvToLatinMap = new Map();
        this.isvAddMap = new Map();
        this.splittedMap = new Map();
        this.splittedMap2 = new Map();
        this.percentsOfChecked = {};
        this.percentsOfChecked = {};
    }

    public init(wordList: string[][]) {
        this.header = wordList.shift().map((l) => l.replace(/\W/g, ''));
        this.langsList = this.header.filter(
            (item) => (['partOfSpeech', 'type', 'sameInLanguages', 'genesis', 'addition', 'id'].indexOf(item) === -1),
        );
        this.headerIndexes = new Map(this.header.map((item, i: number) => [this.header[i], i]));

        this.words = wordList;
        this.words.forEach((item) => {
            const isvWord = this.getField(item, 'isv');
            const add = this.getField(item, 'addition')
                .replace(/[\(\) ]/g, '')
                .split(/[,;/]/)
            ;
            this.isvAddMap.set(this.getField(item, 'addition'), add);
            this.isvToLatinMap.set(isvWord, normalize(getLatin(isvWord, '3')));
            this.splitWords(isvWord)
                .concat(add)
                .map((item) => {
                    this.isvToLatinMap.set(item, normalize(getLatin(item, '3')));
                });
            add.map((item) => {
                this.isvToLatinMap.set(item, normalize(getLatin(item, '3')));
            });
            this.langsList.forEach((from) => {
                const key = `${this.getField(item, from)}-${this.getField(item, 'addition')}`;
                const fromField = this.getField(item, from);
                let splittedField;
                if (from === 'isv') {
                    splittedField = this
                        .splitWords(fromField)
                        .concat(this.isvAddMap.get(this.getField(item, 'addition')))
                    ;
                } else {
                    splittedField = this.splitWords(removeExclamationMark(fromField));
                }

                this.splittedMap.set(key, splittedField.map((chunk) => this.searchPrepare(from, chunk)));
                this.splittedMap2.set(key, splittedField.map((chunk) => this.levenshteinPrepare(from, chunk)));
            });
        });

        this.langsList.forEach((fieldName) => {
            const notChecked = this.words.filter((item) => this.getField(item, fieldName)[0] === '!');
            const count = (1 - notChecked.length / this.words.length) * 100;
            this.percentsOfChecked[fieldName] = count.toFixed(1);
        });
    }
    public getWordList(): string[][] {
        return this.words;
    }
    public translate(
        inputText: string,
        from: string,
        to: string,
        searchType: string,
    ): string[][] {
        const text = this.inputPrepare(from, inputText);
        if (!text) {
            return [];
        }
        const levenText = this.levenshteinPrepare(from, inputText);
        const distMap = new WeakMap();
        const results = this.words
            .filter((item) => {
                const fromField = this.getField(item, from);
                const toField = this.getField(item, to);
                if (fromField === '!' || toField === '!') {
                    return false;
                }
                const splittedField = this.getSplittedField(from, item);
                return splittedField.some((chunk) => searchTypes[searchType](chunk, text));
            })
            .map((item) => {
                const splittedField = this.getSplittedField2(from, item);
                const dist = splittedField
                    .reduce((acc, item) => {
                        const lDist = levenshteinDistance(levenText, item);
                        if (lDist < acc) {
                            return lDist;
                        }
                        return acc;
                    }, Number.MAX_SAFE_INTEGER);
                distMap.set(item, dist);
                return item;
            })
            .sort((a, b) => distMap.get(a) - distMap.get(b))
            .slice(0, 50)
        ;
        return results;
    }

    public formatTranslate(
        results: string[][],
        from: string,
        to: string,
        flavorisationType: string,
    ): ITranslateResult[] {
        return results.map((item) => {
            const isv = this.getField(item, 'isv');
            const add = this.getField(item, 'addition');
            const translate = this.getField(item, (from === 'isv' ? to : from));
            return {
                translate: removeExclamationMark(translate),
                original: getLatin(isv, flavorisationType),
                originalCyr: getCyrillic(isv, flavorisationType),
                originalGla: latinToGla(getLatin(isv, flavorisationType)),
                add: convertCases(getLatin(add, flavorisationType)),
                addCyr: convertCases(getCyrillic(add, flavorisationType)),
                addGla: convertCases(latinToGla(getLatin(add, flavorisationType))),
                details: this.getField(item, 'partOfSpeech'),
                ipa: latinToIpa(getLatin(removeBrackets(isv, '[', ']'), flavorisationType)),
                checked: translate[0] !== '!',
            };
        });

    }
    public getPercentsOfTranslated() {
        return this.percentsOfChecked;
    }
    public isvToEngLatin(text) {
        const latin = this.isvToLatinMap.get(text);
        if (!latin) {
            return normalize(getLatin(text, '3'));
        }
        return latin;
    }
    public getField(item: string[], fieldName: string) {
        return item[this.headerIndexes.get(fieldName)];
    }
    private getSplittedField(from: string, item: string[]): string[] {
        const key = `${this.getField(item, from)}-${this.getField(item, 'addition')}`;
        return this.splittedMap.get(key);
    }
    private getSplittedField2(from: string, item: string[]): string[] {
        const key = `${this.getField(item, from)}-${this.getField(item, 'addition')}`;
        return this.splittedMap2.get(key);
    }
    private splitWords(text: string): string[] {
        return text.includes(';') ? text.split(';') : text.split(',');
    }
    private inputPrepare(lang: string, text: string): string {
        const lowerCaseText = text.toLowerCase()
            .replace(' ', '')
            .replace(',', '')
            .replace(/[\u0300-\u036f]/g, '');
        switch (lang) {
            case 'isv':
                return this.isvToEngLatin(lowerCaseText);
            case 'cs':
            case 'pl':
            case 'sk':
            case 'sl':
            case 'hr':
            case 'de':
                return filterLatin(lowerCaseText);
            case 'ru':
                return lowerCaseText.replace('ё', 'е');
            case 'sr':
                return srGajevicaToVukovica(lowerCaseText);
            default:
                return lowerCaseText;
        }
    }
    private searchPrepare(lang: string, text: string): string {
        const lowerCaseText = this.levenshteinPrepare(lang, text)
            .replace(/[\u0300-\u036f]/g, '');

        switch (lang) {
            case 'isv':
                return this.isvToEngLatin(lowerCaseText);
            case 'cs':
            case 'pl':
            case 'sk':
            case 'sl':
            case 'hr':
            case 'de':
                return filterLatin(lowerCaseText);
            case 'ru':
                return lowerCaseText.replace('ё', 'е');
            default:
                return lowerCaseText;
        }
    }
    private levenshteinPrepare(lang: string, text: string): string {
        let lowerCaseText = text.toLowerCase()
            .replace(' ', '')
            .replace(',', '');

        if (lang !== 'isv') {
            lowerCaseText = removeBrackets(lowerCaseText, '(', ')');
            lowerCaseText = removeBrackets(lowerCaseText, '[', ']');
        } else {
            lowerCaseText = convertCases(lowerCaseText);
            lowerCaseText = removeBrackets(lowerCaseText, '[', ']');
        }
        return lowerCaseText;
    }
}

export const Dictionary = DictionaryClass.getInstance();
