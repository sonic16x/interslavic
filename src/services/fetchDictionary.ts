import { ADD_LANGS } from 'consts'

import { Dictionary, SearchIndex, WordList } from 'services'

import * as msgpack from '@msgpack/msgpack'


async function fetchWithAutoParse(url: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(url, options)

    if (url.endsWith('.msgpack')) {
        const arrayBuffer = await response.arrayBuffer()

        return msgpack.decode(new Uint8Array(arrayBuffer))
    } else {
        return response.json()
    }
}

async function fetchStat() {
    return await fetchWithAutoParse('data/translateStatistic.msgpack') as Promise<Record<string, string>>
}

async function fetchLangs(langList: string[]) {
    return await Promise.all(
        langList.map((lang) => fetchWithAutoParse(`data/${lang}.msgpack`))
    )
}

export interface IBasicData {
    wordList: WordList,
    searchIndex?: SearchIndex,
}

async function fetchBasic(): Promise<IBasicData> {
    return await fetchWithAutoParse('data/basic.msgpack') as Promise<IBasicData>
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

    const [stat, basicData, langsData] = await Promise.all([
        fetchStat(),
        fetchBasic(),
        fetchLangs(langList.filter((lang) => ADD_LANGS.includes(lang)))
    ])

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
