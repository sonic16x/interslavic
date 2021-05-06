import { addLangs, worksheetAddUrl, worksheetUrl } from 'consts';

export const getCeilGoogleSheetsLink = (tablesMaps, id, field) => {
    const isAddTable = addLangs.includes(field);
    const tableName = isAddTable ? 'add' : 'main';
    const letter = tablesMaps[tableName].header.get(field);
    const columntIndex = tablesMaps[tableName].columns.get(id);
    const range = `&range=${letter}${columntIndex + 1}`;

    if (isAddTable) {
        return `${worksheetAddUrl}${range}`;
    } else {
        return `${worksheetUrl}${range}`;
    }
};
