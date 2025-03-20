import { transposeMatrix } from 'utils'

export function sortColumns(columns: string[][], sortColumn: string): string[][] {
    const rows = transposeMatrix<string>(columns)
    const firstRow = rows[0]
    const sortIndex = firstRow.indexOf(sortColumn)

    const sortedRows = [
        firstRow,
        ...rows.slice(1).sort((a, b) => a[sortIndex].localeCompare(b[sortIndex])),
    ]

    return transposeMatrix<string>(sortedRows)
}
