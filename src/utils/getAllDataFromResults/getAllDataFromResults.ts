import { tableColumnsLetters, validFields } from 'consts'

import {
    getColumnName,
    parseTsvTable,
    transposeMatrix,
} from 'utils'

export interface IRangeMap {
    header: Map<string, string>;
    columns: Map<string, string>;
}

export interface IAllData {
    data: string[][];
    columns: string[][];
    rangesMap: IRangeMap[];
}

const getLineId = (line) => line[0]

export const getAllDataFromResults = (results: string[]): IAllData => {
    const existingFields = new Set()
    const idMap = new Map<string, string[]>()
    const rangesMap: IRangeMap[] = []

    results.map((data) => {
        const wordList = parseTsvTable(data.replace(/#/g, ''))

        rangesMap.push({
            header: new Map(wordList[0].map((filed, i) => [filed, tableColumnsLetters[i]])),
            columns: new Map(wordList.map((line, i) => [getLineId(line), (i + 1).toString()])),
        })

        wordList.forEach((line) => {
            const lineId = getLineId(line)

            if (idMap.has(lineId)) {
                const existingLine = idMap.get(lineId)

                idMap.set(lineId, [...existingLine, ...line])
            } else {
                idMap.set(lineId, line)
            }
        })
    })

    const sortedWordList = Array
        .from(idMap.values())
        .sort((a, b) => parseInt(getLineId(a), 10) - parseInt(getLineId(b), 10))
    

    const columns = transposeMatrix(sortedWordList)
        .filter((column: string[]) => {
            const columnName = getColumnName(column)
            const pass = validFields.includes(columnName) && !existingFields.has(columnName)

            if (pass) {
                existingFields.add(columnName)
            }

            return pass
        })
        .map((line) => line.map((el) => typeof el === 'undefined' ? '' : el))
    

    const data = transposeMatrix<string>(columns)

    return {
        data,
        columns,
        rangesMap,
    }
}
