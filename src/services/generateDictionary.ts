import * as fs from 'fs'

import { addLangs, initialAddFields, initialFields,langs } from 'consts'

import { Dictionary, loadTablesData } from 'services'

import { getColumnName, transposeMatrix } from 'utils'

import { gzipSizeSync } from 'gzip-size'


loadTablesData.then(({ data, columns }) => {
    Dictionary.init(data)

    const searchIndex = Dictionary.getIndex()
    const translateStatisticStr = JSON.stringify(Dictionary.getPercentsOfTranslated())

    const basicDataTransposed = []
    const initialFilteredFields = initialFields.filter((field) => !initialAddFields.includes(field))

    columns.forEach((column: string[]) => {
        const fieldName = getColumnName(column)

        if (initialFilteredFields.includes(fieldName) || langs.includes(fieldName)) {
            basicDataTransposed.push(column)
        }
    })

    let basicData = transposeMatrix<string>(basicDataTransposed)

    basicData = [
        basicData[0],
        ...basicData.slice(1).sort((a, b) => a[1].localeCompare(b[1])),
    ]

    const searchIndexBasic = [
        'isv-src',
        'isv',
        'en',
        ...langs,
    ].reduce((searchIndexObj, lang) => {
        searchIndexObj[lang] = searchIndex[lang]

        return searchIndexObj
    }, {})

    const jsonDataStr = JSON.stringify({
        wordList: basicData,
        searchIndex: searchIndexBasic,
    })

    if (!fs.existsSync('./static/data')) {
        fs.mkdirSync('./static/data')
    }

    fs.writeFileSync('./static/data/basic.json', jsonDataStr)
    fs.writeFileSync('./static/data/translateStatistic.json', translateStatisticStr)

    const sizeMB = gzipSizeSync(jsonDataStr) / 1000000
    // eslint-disable-next-line no-console
    console.info(`basic.json g-zip size: ${sizeMB.toFixed(2)} MB`)

    addLangs.forEach((lang) => {
        const langDataTransposed = [
            columns.find(([fieldName]) => fieldName === lang),
        ]

        const langData = transposeMatrix(langDataTransposed)

        const jsonDataStr = JSON.stringify({
            wordList: langData.map(([item]) => item),
            searchIndex: { [lang]: searchIndex[lang] },
        })

        fs.writeFileSync(`./static/data/${lang}.json`, jsonDataStr)
    })
})
