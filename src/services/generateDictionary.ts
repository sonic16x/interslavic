import * as fs from 'fs'

import { ADD_LANGS, EN, initialAddFields, initialFields, ISV, ISV_SRC, LANGS } from 'consts'

import { Dictionary, loadTablesData } from 'services'

import { getColumnName, sortColumns, transposeMatrix } from 'utils'

import { gzipSizeSync } from 'gzip-size'

function logSize(name:string, data: string) {
    const sizeMB = gzipSizeSync(data) / 1000000
    // eslint-disable-next-line no-console
    console.info(`${name} g-zip size: ${sizeMB.toFixed(2)} MB`)
}

async function loadCurrentData() {
    const allData = await Promise.all(
        [
            'basic',
            ...ADD_LANGS,
        ].map((item) => (
            fetch(`https://interslavic-dictionary.com/data/${item}.json`)
                .then((res) => res.text())
                .then((dataStr: string) => [item, dataStr])
        ))
    )

    return new Map(allData as unknown as [string, string][])
}

loadTablesData().then(async ({ data, columns }) => {
    const detectChanges = process.argv.includes('detect-changes')

    const currentData = detectChanges ? await loadCurrentData() : new Map()
    let changed = false

    const sortedColumns = sortColumns(columns, EN)
    Dictionary.init(data)

    const searchIndex = Dictionary.getIndex()
    const translateStatisticStr = JSON.stringify(Dictionary.getPercentsOfTranslated())

    const basicDataTransposed = []
    const initialFilteredFields = initialFields.filter((field) => !initialAddFields.includes(field))

    sortedColumns.forEach((column: string[]) => {
        const fieldName = getColumnName(column)

        if (initialFilteredFields.includes(fieldName) || LANGS.includes(fieldName)) {
            basicDataTransposed.push(column)
        }
    })

    const basicData = transposeMatrix<string>(basicDataTransposed)

    const searchIndexBasic = [
        ISV_SRC,
        ISV,
        EN,
        ...LANGS,
    ].reduce((searchIndexObj, lang) => {
        searchIndexObj[lang] = searchIndex[lang]

        return searchIndexObj
    }, {})

    const jsonDataStr = JSON.stringify({
        wordList: basicData,
        searchIndex: searchIndexBasic,
    })

    changed = currentData.get('basic') === jsonDataStr

    if (!fs.existsSync('./static/data')) {
        fs.mkdirSync('./static/data')
    }

    fs.writeFileSync('./static/data/basic.json', jsonDataStr)
    fs.writeFileSync('./static/data/translateStatistic.json', translateStatisticStr)

    logSize('basic.json', jsonDataStr)


    ADD_LANGS.forEach((lang) => {
        const langDataTransposed = [
            sortedColumns.find(([fieldName]) => fieldName === lang),
        ]

        const langData = transposeMatrix(langDataTransposed)

        const jsonDataStr = JSON.stringify({
            wordList: langData.map(([item]) => item),
            searchIndex: { [lang]: searchIndex[lang] },
        })

        changed = currentData.get('basic') === jsonDataStr

        logSize(`${lang}.json`, jsonDataStr)

        fs.writeFileSync(`./static/data/${lang}.json`, jsonDataStr)
    })

    if (detectChanges && !changed) {
        // eslint-disable-next-line no-console
        console.info('DATA_NO_CHANGED')
    }
})
