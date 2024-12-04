import * as fs from 'fs'

import { Dictionary, IBasicData } from 'services'

import testData from './basic.json'
import { deepDiffMapper } from './deepDiffMapper'
import testSnapshot from './snapshot.json'

const basicData = testData as unknown as IBasicData


Dictionary.init(basicData.wordList, basicData.searchIndex)

const snapshot = {}

const langsPairs = [
    'isv-en',
    'en-isv',
]

const makeSnapshot = process.env.UPDATE_SNAPSHOT

langsPairs.forEach((langsPair) => {
    const [from, to] = langsPair.split('-')

    snapshot[langsPair] = {}

    basicData.wordList.slice(1).forEach((line, i) => {
        if (i % 1000 === 0) {
            // eslint-disable-next-line no-console
            console.info('PROGRESS', langsPair, (100 * i / basicData.wordList.length).toFixed(1) + '%')
        }

        const flavorisationType = '3'
        const alphabets = {
            cyrillic: true,
            glagolitic: false,
            latin: true
        }

        const [results] = Dictionary.translate({
            inputText: line[1],
            from,
            to,
            posFilter: '',
            flavorisationType,
            searchType: 'full'
        })

        snapshot[langsPair][line[0]] = Dictionary.formatTranslate(
            results,
            from,
            to,
            flavorisationType,
            alphabets,
            true,
        )
    })
})

if (makeSnapshot) {
    fs.writeFileSync('./src/services/dictionary-test/snapshot.json', JSON.stringify(snapshot))
} else {
    langsPairs.forEach((langsPair) => {
        Object.keys(snapshot[langsPair]).forEach((id) => {
            if (JSON.stringify(testSnapshot[langsPair][id]) !== JSON.stringify(snapshot[langsPair][id])) {
                // eslint-disable-next-line no-console
                console.error('ERROR', id)
                const diff = deepDiffMapper.map(
                    testSnapshot[langsPair][id],
                    snapshot[langsPair][id]
                )
                // eslint-disable-next-line no-console
                console.info('DIFF', diff)
            }
        })
    })
}
