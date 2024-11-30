import { toQueryString } from 'utils'

export async function getTableHeader(tableId: string, googleAccessToken: string) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${tableId}`

    const queryParams = toQueryString({
        includeGridData: 'true',
        ranges: 'A1:Z1',
    })

    const response = await fetch(`${url}?${queryParams}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${googleAccessToken}`
        },
    })

    const responseJson = await response.json()

    return responseJson.sheets[0].data[0].rowData[0].values.map(({ effectiveValue }) => effectiveValue.stringValue)
}
