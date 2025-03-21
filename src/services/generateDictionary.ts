import * as fs from 'fs'

import { ADD_LANGS, EN, initialAddFields, initialFields, ISV, ISV_SRC, LANGS } from 'consts'

import { Dictionary, loadTablesData } from 'services'

import { getColumnName, sortColumns, transposeMatrix } from 'utils'

import { gzipSizeSync } from 'gzip-size'


loadTablesData().then(({ data, columns }) => {
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

    if (!fs.existsSync('./static/data')) {
        fs.mkdirSync('./static/data')
    }

    fs.writeFileSync('./static/data/basic.json', jsonDataStr)
    fs.writeFileSync('./static/data/translateStatistic.json', translateStatisticStr)

    const sizeMB = gzipSizeSync(jsonDataStr) / 1000000
    // eslint-disable-next-line no-console
    console.info(`basic.json g-zip size: ${sizeMB.toFixed(2)} MB`)

    ADD_LANGS.forEach((lang) => {
        const langDataTransposed = [
            sortedColumns.find(([fieldName]) => fieldName === lang),
        ]

        const langData = transposeMatrix(langDataTransposed)

        const jsonDataStr = JSON.stringify({
            wordList: langData.map(([item]) => item),
            searchIndex: { [lang]: searchIndex[lang] },
        })

        fs.writeFileSync(`./static/data/${lang}.json`, jsonDataStr)
    })
})
