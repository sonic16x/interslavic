import { addLangs,langs } from 'consts';

import { IAlphabets } from 'reducers';

import { convertCases } from 'utils/convertCases';
import { filterLatin } from 'utils/filterLatin';
import { filterNiqqud } from 'utils/filterNiqqud';
import { getCaseTips } from 'utils/getCaseTips';
import { getCyrillic } from 'utils/getCyrillic';
import { getGlagolitic } from 'utils/getGlagolitic';
import { getLatin } from 'utils/getLatin';
import { latinToIpa } from 'utils/latinToIpa';
import { levenshteinDistance } from 'utils/levenshteinDistance';
import { normalize } from 'utils/normalize';
import { removeBrackets } from 'utils/removeBrackets';
import { removeExclamationMark } from 'utils/removeExclamationMark';
import * as searchStrategies from 'utils/searchStrategies';
import { srGajevicaToVukovica } from 'utils/srGajevicaToVukovica';
import {
    getGender,
    getNumeralType,
    getPartOfSpeech,
    getPronounType,
    isAnimated,
    isIndeclinable,
    isPlural,
    isSingular,
} from 'utils/wordDetails';

import { conjugationVerbFlat, declensionAdjectiveFlat, declensionNounFlat, declensionNumeralFlat, declensionPronounFlat } from '@interslavic/utils';

export const searchTypes = {
    begin: searchStrategies.startsWith,
    full: searchStrategies.includesExactly,
    end: searchStrategies.endsWith,
    some: searchStrategies.includes,
};

export interface ITranslateParams {
    inputText: string;
    from: string;
    to: string;
    searchType: string;
    posFilter: string;
    flavorisationType?: string;
}

const isvReplacebleLetters = [
    ['đ', 'dž'],
    ['ć', 'č'],
    ['ž', 'z'],
    ['š', 's'],
    ['č', 'c'],
    ['ě', 'e'],
    ['y', 'i'],
    ['å', 'a'],
    ['ę', 'e'],
    ['ų', 'u'],
    ['ȯ', 'o'],
    ['ė', 'e'],
    ['ŕ', 'r'],
    ['ĺ', 'l'],
    ['ń', 'n'],
    ['ť', 't'],
    ['ď', 'd'],
    ['ś', 's'],
    ['ź', 'z'],
];

function getWordForms(item): string[] {
    const word =  Dictionary.getField(item, 'isv');
    const add = Dictionary.getField(item, 'addition');
    const details = Dictionary.getField(item, 'partOfSpeech');
    const pos = getPartOfSpeech(details);
    const wordForms = [];

    word.split(',').map((wordElement) => {
        wordElement = wordElement.trim();
        switch (pos) {
            case 'verb':
                wordForms.push(...conjugationVerbFlat(wordElement, add));
                break;
            case 'adjective':
                wordForms.push(...declensionAdjectiveFlat(wordElement, ''));
                break;
            case 'noun': {
                const gender = getGender(details);
                const animated = isAnimated(details);
                const plural = isPlural(details);
                const singular = isSingular(details);
                const indeclinable = isIndeclinable(details);
                if (details.includes('m./f.')) {
                    wordForms.push(...declensionNounFlat(wordElement, add, 'masculine', animated, plural,
                        singular, indeclinable));
                    wordForms.push(...declensionNounFlat(wordElement, add, 'feminine', animated, plural,
                        singular, indeclinable));
                } else {
                    wordForms.push(...declensionNounFlat(wordElement, add, gender, animated, plural,
                        singular, indeclinable));
                }
                break;
            }
            case 'pronoun':
                wordForms.push(...declensionPronounFlat(wordElement, getPronounType(details)));
                break;
            case 'numeral':
                wordForms.push(...declensionNumeralFlat(wordElement, getNumeralType(details)));
                break;
        }
    });

    return Array.from(new Set(wordForms.reduce((acc, item) => {
        if (item.includes('/')) {
            return [
                ...acc,
                ...item.split('/').map((word) => word.trim()),
            ];
        }

        return [
            ...acc,
            item,
        ];
    }, [])));
}

export interface ITranslateResult {
    translate: string;
    original: string;
    originalCyr?: string;
    originalGla?: string;
    add: string;
    addCyr?: string;
    addGla?: string;
    caseInfo: string;
    caseInfoCyr?: string;
    caseInfoGla?: string;
    details: string;
    ipa: string;
    isv: string;
    from: string;
    to: string;
    checked: boolean;
    raw: string[];
    id: string;
    new?: boolean;
    intelligibility?: string;
    remove?: boolean;
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
    private splittedMap: {[lang: string]: Map<string, string[]>};
    private isvSearchLetters: { from: string[], to: string[] };
    private isvSearchByWordForms: boolean;

    private constructor() {
        this.header = [];
        this.langsList = [];
        this.headerIndexes = new Map();
        this.splittedMap = {};
        this.percentsOfChecked = {};
        this.isvSearchLetters =  { from: [], to: [] };
    }

    public init(
        wordList: string[][],
        searchIndex?: any | false,
        percentsOfChecked?: any,
    ): number {
        let startInitTime = 0;

        if (typeof performance !== 'undefined') {
            startInitTime = performance.now();
        }

        this.header = wordList[0];

        this.langsList = [
            'isv',
            'en',
            ...langs,
            ...addLangs,
        ].filter((lang) => this.header.includes(lang));

        this.headerIndexes = new Map(this.header.map((item, i: number) => [this.header[i], i]));
        this.words = wordList.slice(1);

        const needIndex = [];

        [
            'isv-src',
            ...this.langsList,
        ].forEach((lang) => {
            if (searchIndex && searchIndex[lang]) {
                this.splittedMap[lang] = new Map(searchIndex[lang]);
            } else {
                needIndex.push(lang);
                this.splittedMap[lang] = new Map();
            }
        });

        if (needIndex.length) {
            this.words.forEach((item) => {
                const id = `${this.getField(item, 'id')}`;

                needIndex.forEach((lang) => {
                    let fromField = this.getField(item, lang === 'isv-src' ? 'isv' : lang);
                    fromField = removeBrackets(fromField, '[', ']');
                    fromField = removeBrackets(fromField, '(', ')');

                    let splittedField;

                    switch (lang) {
                        case 'isv':
                            splittedField = this
                                .splittedMap['isv-src']
                                .get(id)
                                .map((word) => this.searchPrepare(lang, word))
                            ;
                            break;
                        case 'isv-src':
                            splittedField = this
                                .splitWords(fromField)
                                .concat(getWordForms(item))
                                .map((word) => this.searchPrepare('isv-src', getLatin(word, '2')))
                            ;
                            break;
                        default:
                            fromField = removeExclamationMark(fromField);
                            splittedField = this.splitWords(fromField).map((word) => this.searchPrepare(lang, word));
                            break;
                    }

                    this.splittedMap[lang].set(id, splittedField);
                });
            });
        }

        if (!percentsOfChecked) {
            this.langsList.forEach((fieldName) => {
                const notChecked = this.words.filter((item) => this.getField(item, fieldName)[0] === '!');
                const count = (1 - notChecked.length / this.words.length) * 100;
                this.percentsOfChecked[fieldName] = count.toFixed(1);
            });
        } else {
            this.percentsOfChecked = percentsOfChecked;
        }

        let initTime = 0;

        if (typeof performance !== 'undefined') {
            initTime = Math.round(performance.now() - startInitTime);
        }

        return initTime;
    }
    public addLang(wordList: string[], searchIndex?: any) {
        const lang = wordList[0];

        if (this.hasLang(lang)) {
            return;
        }

        wordList.slice(1).forEach((word, i) => {
            this.words[i].push(word);
        });

        this.splittedMap[lang] = new Map(searchIndex[lang]);

        this.header.push(lang);
        this.headerIndexes.set(lang, this.header.length - 1);
    }
    public hasLang(lang): boolean {
        return this.headerIndexes.has(lang);
    }
    public getWordList(): string[][] {
        return this.words;
    }
    public getWord(wordId: string) {
        if (this.words && this.words.length) {
            return this.words.filter((line) => this.getField(line, 'id') === wordId)[0];
        }
    }
    public getIndex() {
        const searchIndex = {};

        [
            'isv-src',
            ...this.langsList,
        ].forEach((lang) => {
            searchIndex[lang] = Array.from(this.splittedMap[lang].keys()).map((key: string) => [
                key,
                this.splittedMap[lang].get(key),
            ]);
        });

        return searchIndex;
    }
    public translate(translateParams: ITranslateParams, showTime = true): [string[][], number] {
        const {
            inputText,
            from,
            to,
            posFilter,
            flavorisationType,
        } = translateParams;
        let searchType = translateParams.searchType;

        if (inputText.slice(0, 2) === 'id') {
            const id = inputText.slice(2);
            const idIsInt = /^-?\d+$/.test(id);

            if (idIsInt) {
                const word = this.getWord(id);

                if (word) {
                    return [[word], 0];
                }
            }
        }

        const inputOptions = inputText.split(' -').map((option) => option.trim());
        const inputWord = inputOptions.shift();
        const lang = from === 'isv' ? to : from;
        const inputIsvPrepared = this.inputPrepare('isv', inputWord);
        const inputLangPrepared = this.inputPrepare(lang, inputWord);

        if (from === 'isv' && !inputIsvPrepared) {
            return [[], 0];
        }

        if (from === lang && !inputLangPrepared) {
            return [[], 0];
        }

        const startTranslateTime = performance.now();

        // option -b - two-way search
        const twoWaySearch = inputOptions.some((o) => o === 'b');

        let isvText = '';
        if (from === 'isv' || twoWaySearch) {
            isvText = inputWord;
            isvText = this.applyIsvSearchLetters(getLatin(isvText, flavorisationType, true), flavorisationType);
            isvText = this.inputPrepare('isv-src', isvText);
        }
        // option -end - search by ending of word
        if (inputOptions.some((option) => option.trim() === 'end')) {
            searchType = 'end';
        }

        // option -etym - hard search by etymological orthography for Isv
        const hardEtymSearch = from === 'isv' && (inputOptions.some((o) => o === 'etym'));

        // filter by part of speech
        let filterPartOfSpeech = [];
        //   option -p, for example "-p noun.m+v.ipf" - search for masculine nouns or imperfective verbs
        const optionPOS = inputOptions.find((option) => option.slice(0, 2) === 'p ');
        if (optionPOS) {
            filterPartOfSpeech = optionPOS
                .slice(2).replace(/[ \/]/g, '')
                .split('+').filter(Boolean).map((elem) => elem.split('.').filter(Boolean));
        //   filter by interface selector
        } else if (posFilter) {
            filterPartOfSpeech = [[posFilter]];
        }

        const distMap = new WeakMap();
        const results = this.getWordList()
            .filter((item) => {
                const word = this.getField(item, lang);

                if (!word || word === '!') {
                    return false;
                }

                let filterResult = false;
                if (from === 'isv' || twoWaySearch) {
                    // hardEtymSearch - hard etymological search for isv, otherwise - simple search
                    // when isvSearchByWordForms = false OR entered 1 symbol - searching without word forms
                    let splittedField = this.getSplittedField(hardEtymSearch ? 'isv-src' : 'isv', item);
                    if ( !this.isvSearchByWordForms || inputIsvPrepared.length === 1 ) {
                        const wordsCount = this.getField(item, 'isv').split(',').length;
                        splittedField = splittedField.slice(0, wordsCount);
                    }
                    filterResult = splittedField.some((chunk) => (
                        searchTypes[searchType](chunk, hardEtymSearch ? inputWord : inputIsvPrepared)
                    ));
                }
                if (to === 'isv' || twoWaySearch) {
                    const splittedField = this.getSplittedField(lang, item);
                    filterResult = filterResult ||
                        splittedField.some((chunk) => searchTypes[searchType](chunk, inputLangPrepared));
                }
                // seach by part of speach
                if (filterResult && filterPartOfSpeech.length) {
                    const partOfSpeech = this.getField(item, 'partOfSpeech')
                        .replace(/[ \/]/g, '').split('.').filter(Boolean);
                    if (partOfSpeech.includes('m') || partOfSpeech.includes('n')
                        || partOfSpeech.includes('f')) {
                        partOfSpeech.push('noun');
                    }
                    if (!filterPartOfSpeech.some((c) => c.every((e) => partOfSpeech.includes(e)))) {
                        return false;
                    }
                }
                
                return filterResult;
            })
            .filter((item) => {
                let filterResult = true;
                // search in isv with search sensitive letters
                if ((from === 'isv' || twoWaySearch) &&
                   !hardEtymSearch && (flavorisationType === '2' || flavorisationType === '3') &&
                    this.isvSearchLetters.to.some((letter) => inputIsvPrepared.includes(letter))) {
                    let splittedField = this.getSplittedField('isv-src', item);
                    if ( !this.isvSearchByWordForms || inputIsvPrepared.length === 1 ) {
                        const wordsCount = this.getField(item, 'isv').split(',').length;
                        splittedField = splittedField.slice(0, wordsCount);
                    }
                    filterResult = splittedField.some((chunk) => (
                        searchTypes[searchType](this.applyIsvSearchLetters(chunk, flavorisationType), isvText)
                    ));
                }
                if (!filterResult && (to === 'isv' || twoWaySearch)) {
                    const splittedField = this.getSplittedField(lang, item);
                    filterResult = filterResult ||
                        splittedField.some((chunk) => searchTypes[searchType](chunk, inputLangPrepared));
                }
                
                return filterResult;
            })
            .map((item) => {
                let splittedField = this.getSplittedField(from, item);
                if (inputWord.length === 1) {
                    splittedField = splittedField.slice(0, 1);
                }
                if (inputWord.length === 2) {
                    splittedField = splittedField.slice(0, 2);
                }
                let dist = splittedField
                    .reduce((acc, item) => {
                        const lDist = levenshteinDistance(from === 'isv' ? inputIsvPrepared : inputLangPrepared,
                            this.searchPrepare(from, item));
                        if (lDist < acc) {
                            return lDist;
                        }

                        return acc;
                    }, Number.MAX_SAFE_INTEGER);
                if (twoWaySearch) {
                    splittedField = this.getSplittedField(to, item);
                    if (inputWord.length === 1) {
                        splittedField = splittedField.slice(0, 1);
                    }
                    if (inputWord.length === 2) {
                        splittedField = splittedField.slice(0, 2);
                    }
                    const dist2 = splittedField
                        .reduce((acc, item) => {
                            const lDist = levenshteinDistance(from === 'isv' ? inputLangPrepared : inputIsvPrepared,
                                this.searchPrepare(to, item));
                            if (lDist < acc) {
                                return lDist;
                            }

                            return acc;
                        }, Number.MAX_SAFE_INTEGER);
                    dist = dist2 < dist ? dist2 : dist;
                }
                distMap.set(item, dist);

                return item;
            })
            .sort((a, b) => distMap.get(a) - distMap.get(b))
            .slice(0, 50)
        ;

        const translateTime = Math.round(performance.now() - startTranslateTime); // @TODO: send to GA

        if (process.env.NODE_ENV !== 'production' && showTime) {
            // eslint-disable-next-line no-console
            console.log('TRANSLATE', `${translateTime}ms`);
        }

        return [results, translateTime];
    }

    public formatTranslate(
        results: string[][],
        from: string,
        to: string,
        flavorisationType: string,
        alphabets?: IAlphabets,
        caseQuestions?: boolean
    ): ITranslateResult[] {
        return results.map((item) => {
            const isvRaw = this.getField(item, 'isv');
            const remove = isvRaw.startsWith('!');
            const isv = remove ? isvRaw.substring(1) : isvRaw;

            const id = this.getField(item, 'id');
            const addArray = this.getField(item, 'addition').match(/\(.+?\)/) || [];
            const add = addArray.find((elem) => !elem.startsWith('(+')) || '';
            let caseInfo = convertCases(addArray.find((elem) => elem.startsWith('(+'))?.slice(1,-1) || '');
            if(caseInfo && caseQuestions) {
                caseInfo = getCaseTips(caseInfo.slice(1),'nounShort');
            }
            const translate = this.getField(item, (from === 'isv' ? to : from));
            const formattedItem: ITranslateResult = {
                translate: removeExclamationMark(translate),
                original: getLatin(isv, flavorisationType),
                add: getLatin(add, flavorisationType),
                caseInfo: caseInfo,
                details: this.getField(item, 'partOfSpeech'),
                ipa: latinToIpa(getLatin(removeBrackets(isv, '[', ']'), flavorisationType)),
                checked: translate[0] !== '!',
                raw: item,
                new: id.startsWith('-'),
                intelligibility: this.getField(item, 'intelligibility'),
                remove,
                from,
                to,
                isv,
                id,
            };
            if (alphabets?.cyrillic) {
                formattedItem.originalCyr = getCyrillic(isv, flavorisationType);
                formattedItem.addCyr = getCyrillic(add, flavorisationType);
                if(caseQuestions) formattedItem.caseInfoCyr = getCyrillic(caseInfo, flavorisationType);
            }
            if (alphabets?.glagolitic) {
                formattedItem.originalGla = getGlagolitic(isv, flavorisationType);
                formattedItem.addGla = getGlagolitic(add, flavorisationType);
                if(caseQuestions) formattedItem.caseInfoGla = getGlagolitic(caseInfo, flavorisationType);
            }

            return formattedItem;
        });

    }
    public getPercentsOfTranslated() {
        return this.percentsOfChecked;
    }
    public isvToEngLatin(text) {
        return normalize(getLatin(text, '3', true))
            .replace(/y/g, 'i');
    }
    public getField(item: string[], fieldName: string) {
        return item[this.headerIndexes.get(fieldName)];
    }
    public changeIsvSearchLetters(letters: string): {from: string[], to: string[]} {
        for (const letter of letters) {
            isvReplacebleLetters
                .filter((replacement) => replacement[0] === letter)
                .map((replacement) => {
                    const index = this.isvSearchLetters.from.indexOf(replacement[0]);
                    if (index !== -1) {
                        this.isvSearchLetters.from.splice(index, 1);
                        this.isvSearchLetters.to.splice(index, 1);
                    } else {
                        this.isvSearchLetters.from.push(replacement[0]);
                        this.isvSearchLetters.to.push(replacement[1]);
                    }
                });
        }

        return this.isvSearchLetters;
    }
    public setIsvSearchLetters(letters: {from: string[], to: string[]}): void {
        this.isvSearchLetters = letters;
    }
    public setIsvSearchByWordForms(isvSearchByWordForms: boolean): void {
        this.isvSearchByWordForms = isvSearchByWordForms;
    }
    public inputPrepare(lang: string, text: string): string {
        const preparedText = this.searchPrepare(lang, text);
        if (lang === 'sr') {
            return srGajevicaToVukovica(preparedText);
        } else {
            return preparedText;
        }
    }
    public searchPrepare(lang: string, text: string): string {
        let lowerCaseText = text
            .toLowerCase()
            .replace(/,/g, '')
            .replace(/[ʼ’]/g, "'");

        if (lang !== 'isv-src') {
            lowerCaseText = lowerCaseText.replace(/[\u0300-\u036f]/g, '');
        } else {
            lowerCaseText = lowerCaseText
                .replace(/t́/g, 'ť')
                .replace(/d́/g, 'ď')
                .replace(/[\u0300-\u036f]/g, '')
            ;
        }
        switch (lang) {
            case 'isv-src':
                return lowerCaseText;
            case 'isv':
                return this.isvToEngLatin(lowerCaseText);
            case 'cs':
            case 'pl':
            case 'sk':
            case 'sl':
            case 'hr':
            case 'de':
            case 'nl':
            case 'eo':
            case 'csb':
            case 'dsb':
            case 'hsb':
            case 'ia':
            case 'es':
            case 'pt':
            case 'fr':
            case 'it':
            case 'da':
                return filterLatin(lowerCaseText);
            case 'ru':
                return lowerCaseText.replace(/ё/g, 'е');
            case 'he':
                return filterNiqqud(lowerCaseText);
            default:
                return lowerCaseText;
        }
    }
    public splitWords(text: string): string[] {
        return text.includes(';') ? text.split(';') : text.split(',');
    }
    private getSplittedField(from: string, item: string[]): string[] {
        const key = this.getField(item, 'id');

        return this.splittedMap[from].get(key);
    }
    private applyIsvSearchLetters(text: string, flavorisationType: string): string {
        text = this.searchPrepare('isv-src', text);
        isvReplacebleLetters
            .filter((replacement) =>
                !this.isvSearchLetters.from.includes(replacement[0]) ||
                flavorisationType === '3' && !['š', 'ž', 'č', 'ě', 'y'].includes(replacement[0]))
            .map((replacement) => {
                text = text.replace(new RegExp(replacement[0], 'g'), replacement[1]);
            });

        return text;
    }
}

export const Dictionary = DictionaryClass.getInstance();
