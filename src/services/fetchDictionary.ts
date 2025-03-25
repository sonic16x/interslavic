import { ADD_LANGS } from 'consts'

import { Dictionary, SearchIndex, WordList } from 'services'

async function fetchStat() {
    return await fetch('data/translateStatistic.json').then((res) => res.json()) as Promise<Record<string, string>>
}

async function fetchLangs(langList: string[]) {
    return await Promise.all(
        langList.map((lang) => fetch(`data/${lang}.json`).then((res) => res.json()))
    )
}

export interface IBasicData {
    wordList: WordList,
    searchIndex?: SearchIndex,
}

async function fetchWordList(): Promise<WordList> {
    return await fetch('data/wordList.json').then((res) => res.json()) as Promise<WordList>
}

async function fetchSearchIndexIsv(): Promise<SearchIndex> {
    return await fetch('data/searchIndexIsv.json').then((res) => res.json()) as Promise<SearchIndex>
}

async function fetchSearchIndexOther(): Promise<SearchIndex> {
    return await fetch('data/searchIndexOther.json').then((res) => res.json()) as Promise<SearchIndex>
}

export async function fetchLang(lang) {
    if (Dictionary.hasLang(lang)) {
        return
    }

    const [{ wordList, searchIndex }] = await fetchLangs([lang])

    Dictionary.addLang(wordList, searchIndex)
}

export async function fetchDictionary(langList: string[]) {
    const startFidTime = performance.now()

    const [stat, wordList, searchIndexIsv, searchIndexOther, langsData] = await Promise.all([
        fetchStat(),
        fetchWordList(),
        fetchSearchIndexIsv(),
        fetchSearchIndexOther(),
        fetchLangs(langList.filter((lang) => ADD_LANGS.includes(lang)))
    ])

    const basicData: IBasicData = {
        wordList,
        searchIndex: {
            ...searchIndexIsv,
            ...searchIndexOther,
        },
    }

    langsData.forEach((langData) => {
        basicData.searchIndex = {
            ...basicData.searchIndex,
            ...langData.searchIndex,
        }
        langData.wordList.forEach((langField, i) => {
            basicData.wordList[i].push(langField)
        })
    })

    const initTime = Dictionary.init(basicData.wordList, basicData.searchIndex, stat)

    const fidTime = Math.round(performance.now() - startFidTime)

    if (__PRODUCTION__) {
        // eslint-disable-next-line no-console
        console.info('FID', `${fidTime}ms`)
        // eslint-disable-next-line no-console
        console.info('INIT', `${initTime}ms`)
    }
}
