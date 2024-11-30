import { tablesData } from 'consts'

import { getAllDataFromResults, getTableDataUrl, IAllData } from 'utils'

export const loadTablesData = new Promise<IAllData>((resolve, reject) => {
    try {
        Promise.all(
            tablesData.map(({ spreadsheetId, sheetId }) => (
                fetch(getTableDataUrl(spreadsheetId, sheetId)).then((res) => res.text())
            )),
        ).then((results: string[]) => resolve(getAllDataFromResults(results)))
    } catch (e) {
        reject(e)
    }
})
