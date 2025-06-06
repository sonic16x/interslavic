import { ADD_LANGS, EN, ISV, ISV_SRC, LANGS } from 'consts'

import { IAlphabets } from 'reducers'

import {
    convertCases,
    deduplicate,
    filterLatin,
    filterNiqqud,
    getCaseTips,
    getCyrillic,
    getGender,
    getGlagolitic,
    getLatin,
    getNumeralType,
    getPartOfSpeech,
    getPronounType,
    isAnimate,
    isIndeclinable,
    isPlural,
    isSingular,
    latinToIpa,
    levenshteinDistance,
    normalize,
    removeBrackets,
    removeExclamationMark,
    searchStrategies,
    srGajevicaToVukovica,
} from 'utils'

import {
    conjugationVerbFlat,
    declensionAdjectiveFlat,
    declensionNounFlat,
    declensionNounSimple,
    declensionNumeralFlat,
    declensionPronounFlat,
} from '@interslavic/utils'

export const searchTypes = {
    begin: searchStrategies.startsWith,
    full: searchStrategies.includesExactly,
    end: searchStrategies.endsWith,
    some: searchStrategies.includes,
}

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
]

function getWordForms(item): string[] {
    const word =  removeExclamationMark(Dictionary.getField(item, 'isv'))
    const add = Dictionary.getField(item, 'addition')
    const details = Dictionary.getField(item, 'partOfSpeech')
    const pos = getPartOfSpeech(details)
    const wordForms = []

    word.split(',').map((wordElement) => {
        wordElement = wordElement.trim()
        switch (pos) {
            case 'verb':
                wordForms.push(...conjugationVerbFlat(wordElement, add))
                break
            case 'adjective':
                wordForms.push(...declensionAdjectiveFlat(wordElement, ''))
                break
            case 'noun': {
                const gender = getGender(details)
                const animate = isAnimate(details)
                const plural = isPlural(details)
                const singular = isSingular(details)
                const indeclinable = isIndeclinable(details)
                if (details.includes('m./f.')) {
                    wordForms.push(...declensionNounFlat(wordElement, add, 'masculine', animate, plural,
                        singular, indeclinable))
                    wordForms.push(...declensionNounFlat(wordElement, add, 'feminine', animate, plural,
                        singular, indeclinable))
                } else {
                    wordForms.push(...declensionNounFlat(wordElement, add, gender, animate, plural,
                        singular, indeclinable))
                }
                break
            }
            case 'pronoun':
                wordForms.push(...declensionPronounFlat(wordElement, getPronounType(details)))
                break
            case 'numeral':
                wordForms.push(...declensionNumeralFlat(wordElement, getNumeralType(details)))
                break
        }
    })

    return Array.from(new Set(wordForms.reduce((acc, item) => {
        if (item.includes('/')) {
            return [
                ...acc,
                ...item.split('/').map((word) => word.trim()),
            ]
        }

        return [
            ...acc,
            item,
        ]
    }, [])))
}

/**
 * Caused by use of fleeting vowels ė and ȯ in masculine nouns.
 */
function getAdditionFormFallback(item): string | undefined {
    const add = Dictionary.getField(item, 'addition')
    if (add) {
        return add
    }

    const details = Dictionary.getField(item, 'partOfSpeech')
    const pos = getPartOfSpeech(details)
    if (pos !== 'noun') {
        return
    }

    const gender = getGender(details)
    if (gender === 'neuter') {
        return
    }

    if (isPlural(details)) {
        return
    }

    const [word, word2] = removeExclamationMark(Dictionary.getField(item, 'isv')).split(',')
    if (word2) {
        return
    }

    const paradigms = gender === 'masculineOrFeminine' ? [
        declensionNounSimple(word, details, undefined, 'masculine'),
        declensionNounSimple(word, details, undefined, 'feminine'),
    ] : [
        declensionNounSimple(word, details)
    ]

    for (const result of paradigms) {
        if (!result) continue

        const { nom: [nom], gen: [gen] } = result
        if (nom && gen) {
            const nom1 = nom.slice(0, -1)
            const gen1 = gen.slice(0, nom1.length)
            if (nom1 !== gen1) {
                return `(${gen})`
            }
        }
    }

    return
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
    /**
     * 1 - universally intelligible
     * 2 - predominantly intelligible
     * 3 - regionally intelligible
     * 4 - Church Slavonic
     * 5 - neologism
     * 9 - doubtful
     */
    type?: number;
}

export type WordList = string[][]
export type SearchIndex = Record<string, Array<[string, string[]]>>

class DictionaryClass {
    public static getInstance(): DictionaryClass {
        if (!DictionaryClass.instance) {
            DictionaryClass.instance = new DictionaryClass()
        }

        return DictionaryClass.instance
    }

    private static instance: DictionaryClass

    private header: string[]
    private langsList: string[]
    private headerIndexes: Map<string, number>
    private percentsOfChecked: {[lang: string]: string}
    private words: WordList
    private splittedMap: {[lang: string]: Map<string, string[]>}
    private isvSearchLetters: { from: string[], to: string[] }
    private isvSearchByWordForms: boolean

    private constructor() {
        this.header = []
        this.langsList = []
        this.headerIndexes = new Map()
        this.splittedMap = {}
        this.percentsOfChecked = {}
        this.isvSearchLetters =  { from: [], to: [] }
    }

    public init(
        wordList: WordList,
        searchIndex?: SearchIndex,
        percentsOfChecked?: Record<string, string>,
    ): number {
        let startInitTime = 0

        if (typeof performance !== 'undefined') {
            startInitTime = performance.now()
        }

        this.header = wordList[0]

        this.langsList = [
            ISV,
            EN,
            ...LANGS,
            ...ADD_LANGS,
        ].filter((lang) => this.header.includes(lang))

        this.headerIndexes = new Map(this.header.map((item, i: number) => [this.header[i], i]))
        this.words = wordList.slice(1)

        const needIndex = [];

        [
            ISV_SRC,
            ...this.langsList,
        ].forEach((lang) => {
            if (searchIndex && searchIndex[lang]) {
                this.splittedMap[lang] = new Map(searchIndex[lang])
            } else {
                needIndex.push(lang)
                this.splittedMap[lang] = new Map()
            }
        })

        if (needIndex.length) {
            this.words.forEach((item) => {
                const id = `${this.getField(item, 'id')}`

                needIndex.forEach((lang) => {
                    let fromField = this.getField(item, lang === ISV_SRC ? ISV : lang)

                    fromField = removeBrackets(fromField, '[', ']')
                    fromField = removeBrackets(fromField, '(', ')')
                    fromField = removeExclamationMark(fromField)

                    let splittedField

                    switch (lang) {
                        case ISV:
                            splittedField = deduplicate(
                                this
                                    .splittedMap[ISV_SRC]
                                    .get(id)
                                    .map((word) => this.searchPrepare(lang, word))
                            )
                            break
                        case ISV_SRC:
                            splittedField = deduplicate(
                                this
                                    .splitWords(fromField)
                                    .concat(getWordForms(item))
                                    .map((word) => this.searchPrepare(ISV_SRC, getLatin(word, '2')))
                            )

                            break
                        default:
                            splittedField = this.splitWords(fromField).map((word) => this.searchPrepare(lang, word))
                            break
                    }

                    this.splittedMap[lang].set(id, splittedField)
                })
            })
        }

        if (!percentsOfChecked) {
            this.langsList.forEach((fieldName) => {
                const notChecked = this.words.filter((item) => this.getField(item, fieldName)[0] === '!')
                const count = (1 - notChecked.length / this.words.length) * 100
                this.percentsOfChecked[fieldName] = count.toFixed(1)
            })
        } else {
            this.percentsOfChecked = percentsOfChecked
        }

        let initTime = 0

        if (typeof performance !== 'undefined') {
            initTime = Math.round(performance.now() - startInitTime)
        }

        return initTime
    }
    public addLang(wordList: string[], searchIndex?: SearchIndex) {
        const lang = wordList[0]

        if (this.hasLang(lang)) {
            return
        }

        wordList.slice(1).forEach((word, i) => {
            this.words[i].push(word)
        })

        this.splittedMap[lang] = new Map(searchIndex[lang])

        this.header.push(lang)
        this.headerIndexes.set(lang, this.header.length - 1)
    }
    public hasLang(lang): boolean {
        return this.headerIndexes.has(lang)
    }
    public getWordList(): WordList {
        return this.words
    }
    public getWord(wordId: string) {
        if (this.words && this.words.length) {
            return this.words.filter((line) => this.getField(line, 'id') === wordId)[0]
        }
    }
    public getIndex(): SearchIndex {
        const searchIndex = {};

        [
            ISV_SRC,
            ...this.langsList,
        ].forEach((lang) => {
            searchIndex[lang] = Array.from(this.splittedMap[lang].keys()).map((key: string) => [
                key,
                this.splittedMap[lang].get(key)
            ])
        })

        return searchIndex
    }
    public translate(translateParams: ITranslateParams, showTime = true): [WordList, number] {
        const {
            inputText,
            from,
            to,
            posFilter,
            flavorisationType,
        } = translateParams
        let searchType = translateParams.searchType

        if (inputText.slice(0, 2) === 'id') {
            const id = inputText.slice(2)
            const idIsInt = /^-?\d+$/.test(id)

            if (idIsInt) {
                const word = this.getWord(id)

                if (word) {
                    return [[word], 0]
                }
            }
        }

        const inputOptions = inputText.split(' -').map((option) => option.trim())
        const inputWord = inputOptions.shift()
        const lang = from === ISV ? to : from
        const inputIsvPrepared = this.inputPrepare(ISV, inputWord)
        const inputLangPrepared = this.inputPrepare(lang, inputWord)

        if (from === ISV && !inputIsvPrepared) {
            return [[], 0]
        }

        if (from === lang && !inputLangPrepared) {
            return [[], 0]
        }

        const startTranslateTime = performance.now()

        // option -b - two-way search
        const twoWaySearch = inputOptions.some((o) => o === 'b')

        let isvText = ''
        if (from === ISV || twoWaySearch) {
            isvText = inputWord
            isvText = this.applyIsvSearchLetters(getLatin(isvText, flavorisationType, true), flavorisationType)
            isvText = this.inputPrepare(ISV_SRC, isvText)
        }
        // option -end - search by ending of word
        if (inputOptions.some((option) => option.trim() === 'end')) {
            searchType = 'end'
        }

        // option -etym - hard search by etymological orthography for Isv
        const hardEtymSearch = from === ISV && (inputOptions.some((o) => o === 'etym'))

        // filter by part of speech
        let filterPartOfSpeech = []
        //   option -p, for example "-p noun.m+v.ipf" - search for masculine nouns or imperfective verbs
        const optionPOS = inputOptions.find((option) => option.slice(0, 2) === 'p ')
        if (optionPOS) {
            filterPartOfSpeech = optionPOS
                .slice(2).replace(/[ \/]/g, '')
                .split('+').filter(Boolean).map((elem) => elem.split('.').filter(Boolean))
        //   filter by interface selector
        } else if (posFilter) {
            filterPartOfSpeech = [[posFilter]]
        }

        const distMap = new Map()
        const rawResults = this.getWordList()
            .filter((item) => {
                const word = this.getField(item, lang)
                if (!word || word === '!') {
                    return false
                }

                let filterResult = false
                if (from === ISV || twoWaySearch) {
                    // hardEtymSearch - hard etymological search for isv, otherwise - simple search
                    // when isvSearchByWordForms = false OR entered 1 symbol - searching without word forms
                    let splittedField = this.getSplittedField(hardEtymSearch ? ISV_SRC : ISV, item)
                    if ( !this.isvSearchByWordForms || inputIsvPrepared.length === 1 ) {
                        const wordsCount = this.getField(item, ISV).split(',').length
                        splittedField = splittedField.slice(0, wordsCount)
                    }
                    filterResult = splittedField.some((chunk) => (
                        searchTypes[searchType](chunk, hardEtymSearch ? inputWord : inputIsvPrepared)
                    ))
                }
                if (to === ISV || twoWaySearch) {
                    const splittedField = this.getSplittedField(lang, item)
                    filterResult = filterResult ||
                        splittedField.some((chunk) => searchTypes[searchType](chunk, inputLangPrepared))
                }
                // seach by part of speach
                if (filterResult && filterPartOfSpeech.length) {
                    const partOfSpeech = this.getField(item, 'partOfSpeech')
                        .replace(/[ \/]/g, '').split('.').filter(Boolean)
                    if (partOfSpeech.includes('m') || partOfSpeech.includes('n')
                        || partOfSpeech.includes('f')) {
                        partOfSpeech.push('noun')
                    }
                    if (!filterPartOfSpeech.some((c) => c.every((e) => partOfSpeech.includes(e)))) {
                        return false
                    }
                }

                return filterResult
            })
            .filter((item) => {
                let filterResult = true
                // search in isv with search sensitive letters
                if ((from === ISV || twoWaySearch) &&
                   !hardEtymSearch && (flavorisationType === '2' || flavorisationType === '3') &&
                    this.isvSearchLetters.to.some((letter) => inputIsvPrepared.includes(letter))) {
                    let splittedField = this.getSplittedField(ISV_SRC, item)
                    if ( !this.isvSearchByWordForms || inputIsvPrepared.length === 1 ) {
                        const wordsCount = this.getField(item, ISV).split(',').length
                        splittedField = splittedField.slice(0, wordsCount)
                    }
                    filterResult = splittedField.some((chunk) => (
                        searchTypes[searchType](this.applyIsvSearchLetters(chunk, flavorisationType), isvText)
                    ))
                }
                if (!filterResult && (to === ISV || twoWaySearch)) {
                    const splittedField = this.getSplittedField(lang, item)
                    filterResult = filterResult ||
                        splittedField.some((chunk) => searchTypes[searchType](chunk, inputLangPrepared))
                }

                return filterResult
            })
            .map((originItem) => {
                // Need to fix redux error, when load new lang (mutable rawResults between dispatches)
                const item = originItem.slice(0)

                let splittedField = this.getSplittedField(from, item)
                if (inputWord.length === 1) {
                    splittedField = splittedField.slice(0, 1)
                }
                if (inputWord.length === 2) {
                    splittedField = splittedField.slice(0, 2)
                }
                let dist = splittedField
                    .reduce((acc, item) => {
                        const lDist = levenshteinDistance(from === ISV ? inputIsvPrepared : inputLangPrepared,
                            this.searchPrepare(from, item))
                        if (lDist < acc) {
                            return lDist
                        }

                        return acc
                    }, Number.MAX_SAFE_INTEGER)
                if (twoWaySearch) {
                    splittedField = this.getSplittedField(to, item)
                    if (inputWord.length === 1) {
                        splittedField = splittedField.slice(0, 1)
                    }
                    if (inputWord.length === 2) {
                        splittedField = splittedField.slice(0, 2)
                    }
                    const dist2 = splittedField
                        .reduce((acc, item) => {
                            const lDist = levenshteinDistance(from === ISV ? inputLangPrepared : inputIsvPrepared,
                                this.searchPrepare(to, item))
                            if (lDist < acc) {
                                return lDist
                            }

                            return acc
                        }, Number.MAX_SAFE_INTEGER)
                    dist = dist2 < dist ? dist2 : dist
                }
                distMap.set(item, dist)

                return item
            })
            .sort((a, b) => {
                // compare likeness
                const dD = distMap.get(a) - distMap.get(b)
                if (dD) return dD

                // compare voting ranks
                const dR = this.getRank(a) - this.getRank(b)
                if (dR) return dR

                // compare target language strings
                return this.getField(a, to).localeCompare(this.getField(b, to))
            })
            .slice(0, 50)


        const translateTime = Math.round(performance.now() - startTranslateTime)

        if (!__PRODUCTION__ && showTime) {
            // eslint-disable-next-line no-console
            console.log('TRANSLATE', `${translateTime}ms`)
        }

        return [rawResults, translateTime]
    }

    public formatTranslate(
        results: WordList,
        from: string,
        to: string,
        flavorisationType: string,
        alphabets?: IAlphabets,
        caseQuestions?: boolean
    ): ITranslateResult[] {
        return results.map((item) => {
            const isvRaw = this.getField(item, ISV)
            const remove = isvRaw.startsWith('!')
            const isv = removeBrackets(
                removeExclamationMark(isvRaw), '[', ']'
            )

            const id = this.getField(item, 'id')
            const addArray: string[] = this.getField(item, 'addition').match(/\(.+?\)/) || []
            if (addArray.length === 0) {
                const addFallback = getAdditionFormFallback(item)
                if (addFallback) {
                    addArray.push(addFallback)
                }
            }
            const add = addArray.find((elem) => !elem.startsWith('(+')) || ''
            let caseInfo = convertCases(addArray.find((elem) => elem.startsWith('(+'))?.slice(1, -1) || '')
            if(caseInfo && caseQuestions) {
                caseInfo = getCaseTips(caseInfo.slice(1), 'nounShort')
            }
            const translate = this.getField(item, (from === ISV ? to : from))
            const formattedItem: ITranslateResult = {
                translate: removeExclamationMark(translate),
                original: getLatin(isv, flavorisationType),
                add: getLatin(add, flavorisationType),
                caseInfo: caseInfo,
                details: this.getField(item, 'partOfSpeech'),
                ipa: latinToIpa(getLatin(removeBrackets(isv, '[', ']'), flavorisationType)),
                checked: translate[0] !== '!',
                type: Number(this.getField(item, 'type') || '2'),
                raw: item,
                new: id.startsWith('-'),
                intelligibility: this.getField(item, 'intelligibility'),
                remove,
                from,
                to,
                isv,
                id,
            }
            if (alphabets?.cyrillic) {
                formattedItem.originalCyr = getCyrillic(isv, flavorisationType)
                formattedItem.addCyr = getCyrillic(add, flavorisationType)
                if(caseQuestions) formattedItem.caseInfoCyr = getCyrillic(caseInfo, flavorisationType)
            }
            if (alphabets?.glagolitic) {
                formattedItem.originalGla = getGlagolitic(isv, flavorisationType)
                formattedItem.addGla = getGlagolitic(add, flavorisationType)
                if(caseQuestions) formattedItem.caseInfoGla = getGlagolitic(caseInfo, flavorisationType)
            }

            return formattedItem
        })

    }
    public getPercentsOfTranslated() {
        return this.percentsOfChecked
    }
    public isvToEngLatin(text) {
        return normalize(getLatin(text, '3', true))
            .replace(/y/g, 'i')
    }
    public getField(item: string[], fieldName: string) {
        return item[this.headerIndexes.get(fieldName)]
    }
    public changeIsvSearchLetters(letters: string): {from: string[], to: string[]} {
        const isvSearchLetters = {
            from: [...this.isvSearchLetters.from],
            to: [...this.isvSearchLetters.to],
        }

        for (const letter of letters) {
            isvReplacebleLetters
                .filter((replacement) => replacement[0] === letter)
                .map((replacement) => {
                    const index = isvSearchLetters.from.indexOf(replacement[0])
                    if (index !== -1) {
                        isvSearchLetters.from.splice(index, 1)
                        isvSearchLetters.to.splice(index, 1)
                    } else {
                        isvSearchLetters.from.push(replacement[0])
                        isvSearchLetters.to.push(replacement[1])
                    }
                })
        }

        this.isvSearchLetters = isvSearchLetters

        return isvSearchLetters
    }
    public setIsvSearchLetters(letters: {from: string[], to: string[]}): void {
        this.isvSearchLetters = letters
    }
    public setIsvSearchByWordForms(isvSearchByWordForms: boolean): void {
        this.isvSearchByWordForms = isvSearchByWordForms
    }
    public inputPrepare(lang: string, text: string): string {
        const preparedText = this.searchPrepare(lang, text)
        if (lang === 'sr') {
            return srGajevicaToVukovica(preparedText)
        } else {
            return preparedText
        }
    }
    public searchPrepare(lang: string, text: string): string {
        let lowerCaseText = text
            .toLowerCase()
            .replace(/,/g, '')
            .replace(/[ʼ’]/g, "'")

        if (lang !== ISV_SRC) {
            lowerCaseText = lowerCaseText.replace(/[\u0300-\u036f]/g, '')
        } else {
            lowerCaseText = lowerCaseText
                .replace(/t́/g, 'ť')
                .replace(/d́/g, 'ď')
                .replace(/[\u0300-\u036f]/g, '')

        }
        switch (lang) {
            case ISV_SRC:
                return lowerCaseText
            case ISV:
                return this.isvToEngLatin(lowerCaseText)
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
                return filterLatin(lowerCaseText)
            case 'ru':
                return lowerCaseText.replace(/ё/g, 'е')
            case 'he':
                return filterNiqqud(lowerCaseText)
            default:
                return lowerCaseText
        }
    }
    public splitWords(text: string): string[] {
        return (text.includes(';') ? text.split(';') : text.split(',')).map(e => e.trim())
    }
    private getSplittedField(from: string, item: string[]): string[] {
        const key = this.getField(item, 'id')

        return this.splittedMap[from].get(key)
    }
    private applyIsvSearchLetters(text: string, flavorisationType: string): string {
        text = this.searchPrepare(ISV_SRC, text)
        isvReplacebleLetters
            .filter((replacement) =>
                !this.isvSearchLetters.from.includes(replacement[0]) ||
                flavorisationType === '3' && !['š', 'ž', 'č', 'ě', 'y'].includes(replacement[0]))
            .map((replacement) => {
                text = text.replace(new RegExp(replacement[0], 'g'), replacement[1])
            })

        return text
    }
    private getRank(item: string[]): number {
        const rank = Number.parseInt(this.getField(item, 'type'), 10)
        // Assume normal rank if unclear (2)
        if (Number.isNaN(rank)) return 2
        // Upgrade neologisms (5) to normal rank (2)
        if (rank === 5) return 2
        // Do not distinguish between Old Church Slavonic (4) and regionally intelligible (3)
        if (rank === 4) return 3

        return rank
    }
}

export const Dictionary = DictionaryClass.getInstance()
