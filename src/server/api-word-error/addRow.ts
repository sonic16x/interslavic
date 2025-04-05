import { toQueryString } from 'utils'

export async function addRow(tableId, row, googleAccessToken) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${tableId}/values/A1:append`
    const queryParams = toQueryString({
        includeValuesInResponse: 'true',
        insertDataOption: 'INSERT_ROWS',
        responseDateTimeRenderOption: 'SERIAL_NUMBER',
        responseValueRenderOption: 'UNFORMATTED_VALUE',
        valueInputOption: 'USER_ENTERED',
    })

    return await fetch(`${url}?${queryParams}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${googleAccessToken}`
        },
        body: JSON.stringify({
            values: [
                row,
            ],
        }),
    })
}
