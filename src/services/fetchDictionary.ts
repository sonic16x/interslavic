import { ADD_LANGS } from 'consts'

import { isLoadingAction, runSearch } from 'actions'

import { Dictionary, SearchIndex, WordList } from 'services'

async function fetchStat() {
    return fetch('data/translateStatistic.json').then((res) => res.json()).then((data) => data)
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

async function fetchBasic(): Promise<IBasicData> {
    return await fetch('data/basic.json').then((res) => res.json())
}

export async function fetchLang(lang) {
    if (Dictionary.hasLang(lang)) {
        return
    }

    const [{ wordList, searchIndex }] = await fetchLangs([lang])

    Dictionary.addLang(wordList, searchIndex)
}

export async function fetchDictionary(dispatch, langList: string[]) {
    const startFidTime = performance.now()

    const stat = await fetchStat()
    const basicData = await fetchBasic()
    const langsData = await fetchLangs(langList.filter((lang) => ADD_LANGS.includes(lang)))

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

    // dispatch(loadingProgressAction(100));
    dispatch(isLoadingAction(false))
    dispatch(runSearch())

    const fidTime = Math.round(performance.now() - startFidTime)

    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.info('FID', `${fidTime}ms`)
        // eslint-disable-next-line no-console
        console.info('INIT', `${initTime}ms`)
    }
}
