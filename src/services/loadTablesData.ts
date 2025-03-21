import { tablesData } from 'consts'

import { getAllDataFromResults, getTableDataUrl, IAllData } from 'utils'

export const loadTablesData = async (): Promise<IAllData> => {
    const results = await Promise.all(
        tablesData.map(({ spreadsheetId, sheetId }) => (
            fetch(getTableDataUrl(spreadsheetId, sheetId)).then((res) => res.text())
        )),
    )

    return getAllDataFromResults(results)
}
