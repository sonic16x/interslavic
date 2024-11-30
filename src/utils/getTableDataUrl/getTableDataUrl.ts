export const getTableDataUrl = (spreadsheetId: string, sheetId: string) => (
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=tsv&gid=${sheetId}`
)
