export const getTablePublicUrl = (spreadsheetId: string, sheetId: string) => (
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheetId}`
)
