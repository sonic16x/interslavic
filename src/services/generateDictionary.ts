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

    const searchIndexIsv = [
        ISV_SRC,
        ISV,
    ].reduce((searchIndexObj, lang) => {
        searchIndexObj[lang] = searchIndex[lang]

        return searchIndexObj
    }, {})

    const searchIndexOther = [
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

    const wordListStr = JSON.stringify(basicData)
    const searchIndexStr = JSON.stringify(searchIndexBasic)
    const searchIndexIsvStr = JSON.stringify(searchIndexIsv)
    const searchIndexOtherStr = JSON.stringify(searchIndexOther)

    fs.writeFileSync('./static/data/basic.json', jsonDataStr)
    fs.writeFileSync('./static/data/wordList.json', wordListStr)
    fs.writeFileSync('./static/data/searchIndex.json', searchIndexStr)
    fs.writeFileSync('./static/data/searchIndexIsv.json', searchIndexIsvStr)
    fs.writeFileSync('./static/data/searchIndexOther.json', searchIndexOtherStr)
    fs.writeFileSync('./static/data/translateStatistic.json', translateStatisticStr)

    logSize('basic.json', jsonDataStr)
    logSize('wordList.json', wordListStr)
    logSize('searchIndex.json', searchIndexStr)
    logSize('searchIndexIsv.json', searchIndexIsvStr)
    logSize('searchIndexOther.json', searchIndexOtherStr)

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
